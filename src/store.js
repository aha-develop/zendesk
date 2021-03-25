import { EXTENSION_ID, settings } from "./extension";
import { store } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { zendeskFetch } from "./zendesk";

export function makeStore() {
  return store({
    configured: false,
    dashboardViews: settings.dashboardViews || [],
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
