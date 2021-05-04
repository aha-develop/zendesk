import { EXTENSION_ID, TICKET_FIELD, settings } from "./extension";
import { store } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { getUserPreference, setUserPreference } from "./fields";
import { descriptionForItem, zendeskFetch } from "./zendesk";

const DASHBOARD_VIEWS = "DASHBOARD_VIEWS";

export function makeStore() {
  return store({
    configured: false,
    loaded: false,
    dashboardViews: { loading: true, value: [] },
    settings,
    authenticatedUser: null,
    importedItems: { loading: true, value: {} },
    importing: {},
    loadingAuth: true,
    users: {},
    viewData: {},
    views: { loading: true, value: null },
  });
}

export const sharedStore = makeStore();

export function observable(value) {
  sharedStore._tempObservable = value;
  return sharedStore._tempObservable;
}

export function loadData() {
  if (!sharedStore.loaded) {
    sharedStore.loaded = true;
    loadViews();
    loadUserFields();
    loadImportedItems();
  }
}

export async function checkAuth() {
  if (!sharedStore.authenticatedUser) {
    await authenticateUser({ authOptions: { reAuth: false } });
  }
}

export async function authenticateUser(options = {}) {
  sharedStore.loadingAuth = true;
  try {
    sharedStore.authenticatedUser = (await zendeskFetch("/users/me", {}, options)).user;
  } catch (e) {
    // Failed, remove authenticatedUser
    sharedStore.authenticatedUser = null;
  } finally {
    sharedStore.loadingAuth = false;
  }
}

export async function loadUserFields() {
  sharedStore.dashboardViews.loading = true;
  sharedStore.dashboardViews.value = (await getUserPreference(DASHBOARD_VIEWS)) || [];
  sharedStore.dashboardViews.loading = false;
}

export async function loadImportedItems() {
  sharedStore.importedItems.loading = true;
  const { extensionFields } = await aha.graphQuery(`
{
  extensionFields(filters: {extensionIdentifier: "${EXTENSION_ID}", extensionFieldableType: FEATURE, name: "${TICKET_FIELD}"}) {
    nodes {
      value
      extensionFieldable {
        ... on Feature {
          referenceNum
          name
        }
      }
      __typename
    }
    __typename
  }
}
`);

  sharedStore.importedItems.value = extensionFields.nodes.reduce((acc, extensionField) => {
    acc[extensionField.value] = extensionField.extensionFieldable;
    return acc;
  }, {});

  sharedStore.importedItems.loading = false;
}

export async function addDashboardView({ id, title }) {
  const currentViews = sharedStore.dashboardViews.value || [];
  const existingView = currentViews.find(currentView => currentView.id === id);

  if (!existingView) {
    const newViews = (sharedStore.dashboardViews.value = [...currentViews, { id, title }]);

    await setUserPreference(DASHBOARD_VIEWS, newViews);
  }
}

export async function removeDashboardView(id) {
  const currentViews = sharedStore.dashboardViews.value || [];
  const newViews = (sharedStore.dashboardViews.value = observable(
    currentViews.filter(currentView => currentView.id !== id),
  ));

  // Optimistic save, return with new value immediately
  await setUserPreference(DASHBOARD_VIEWS, newViews);
}

export async function importItem(item) {
  const { id } = item.ticket;
  sharedStore.importing[id] = true;

  const feature = new window.aha.models.Feature({
    name: item.subject,
    description: descriptionForItem(item),
    team: { id: aha.project.id },
  });

  await feature.save({ query: feature.query.select("referenceNum") });

  await feature.setExtensionField(EXTENSION_ID, TICKET_FIELD, item.ticket.id);

  sharedStore.importedItems.value[id] = feature;
  sharedStore.importing[id] = false;

  return feature;
}

export async function loadViews(force = false) {
  const { views } = sharedStore;
  if (force || !views.value) {
    views.loading = true;

    const response = await zendeskFetch("/views");
    views.value = response.views.filter(view => view.active);

    views.loading = false;
  }
}

export async function updateSetting(key, mutatorOrValue, scope = "user") {
  const { settings } = sharedStore;
  const currentValue = settings[key];
  const newValue = observable(
    typeof mutatorOrValue === "function" ? await mutatorOrValue(currentValue) : mutatorOrValue,
  );
  settings[key] = newValue;

  const mutation = `
    mutation {
      createExtensionSetting(attributes: {
        identifier: ${JSON.stringify([EXTENSION_ID, key].join("."))},
        value: ${JSON.stringify(newValue)},
        scope: ${JSON.stringify(scope)}
      }) {
        errors {
          attributes {
            name
            messages
            fullMessages
            codes
          }
        }
      }
    }
  `;

  await aha.graphMutate(mutation);
  return newValue;
}

function populateUsers(users) {
  users.forEach(user => {
    sharedStore.users[user.id] = user;
  });
}

export async function loadViewData(id) {
  if (!(id in sharedStore.viewData)) {
    sharedStore.viewData[id] = { loading: true, data: null };
    const data = (sharedStore.viewData[id].data = await zendeskFetch(`/views/${id}/execute`));

    populateUsers(data.users);

    sharedStore.viewData[id].loading = false;
  }
}
