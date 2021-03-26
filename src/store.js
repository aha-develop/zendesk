import { EXTENSION_ID, settings } from "./extension";
import { store } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { getUserPreference, setUserPreference } from "./fields";
import { zendeskFetch } from "./zendesk";

const DASHBOARD_VIEWS = "DASHBOARD_VIEWS";

export function makeStore() {
  return store({
    configured: false,
    loaded: false,
    dashboardViews: { loading: true, value: [] },
    settings,
    authenticatedUser: null,
    loadingAuth: true,
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
    // await aha.auth("zendesk", { reAuth: false, useCachedRetry: true });
    // sharedStore.authenticatedUser = await zendeskFetch("/users/me");
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

export async function loadViewData(id) {
  if (!(id in sharedStore.viewData)) {
    sharedStore.viewData[id] = { loading: true, data: null };
    sharedStore.viewData[id].data = await zendeskFetch(`/views/${id}/execute`);
    sharedStore.viewData[id].loading = false;
  }
}
