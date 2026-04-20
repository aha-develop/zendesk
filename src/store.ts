import { store } from "@aha-app/react-easy-state";
import * as z from "zod";
import { EXTENSION_ID, TICKET_FIELD, settings } from "./extension";
import { getUserPreference, setUserPreference } from "./fields";
import {
  DashboardViewCodec,
  ExtensionField,
  ExtensionFieldsResponseCodec,
  FeatureReference,
  Store,
  User,
  UserCodec,
  View,
  ViewData,
  ViewDataCodec,
  ViewResponseCodec,
  ZendeskItem,
} from "./types";
import { descriptionForItem, zendeskFetch } from "./zendesk";

const DASHBOARD_VIEWS = "DASHBOARD_VIEWS";

export function makeStore(): Store {
  return store({
    configured: false,
    loaded: false,
    dashboardViews: { loading: false, value: [] },
    settings,
    authenticatedUser: null,
    importedItems: { loading: false, value: {} },
    importing: {},
    loadingAuth: false,
    refreshing: false,
    users: {},
    viewData: {},
    views: { loading: false, value: null },
    searchTerm: "",
    _tempObservable: null,
  });
}

export const sharedStore = makeStore();

export function observable<T>(value: T): T {
  sharedStore._tempObservable = value;
  return sharedStore._tempObservable as T;
}

export function loadData() {
  if (!sharedStore.loaded) {
    sharedStore.loaded = true;
    loadViews();
    loadUserFields();
  }
  // Always refresh imported items to catch changes from other users/sessions
  loadImportedItems();
}

export async function checkAuth() {
  if (!sharedStore.authenticatedUser) {
    await authenticateUser({ authOptions: { reAuth: false } });
  }
}

export async function authenticateUser(options = {}) {
  sharedStore.loadingAuth = true;
  try {
    const me = await zendeskFetch("/users/me", {}, { ...options, codec: z.object({ user: UserCodec }) });
    sharedStore.authenticatedUser = me.user;
  } catch {
    // Failed, remove authenticatedUser
    sharedStore.authenticatedUser = null;
  } finally {
    sharedStore.loadingAuth = false;
  }
}

export async function loadUserFields() {
  sharedStore.dashboardViews.loading = true;
  sharedStore.dashboardViews.value = await loadDashboardViews();
  sharedStore.dashboardViews.loading = false;
}

async function fetchExtensionFields({
  page,
  per,
  value,
}: { page?: number; per?: number; value?: string } = {}): Promise<ExtensionField[]> {
  const pagination = page ? `page: ${page}, per: ${per}, ` : "";
  const valueFilter = value ? `, value: "${value}"` : "";

  const res = await aha.graphQuery(`
{
  extensionFields(${pagination}filters: {extensionIdentifier: "${EXTENSION_ID}", extensionFieldableType: FEATURE, name: "${TICKET_FIELD}"${valueFilter}}) {
    nodes {
      value
      extensionFieldable {
        ... on Feature {
          referenceNum
          name
        }
      }
    }
  }
}
`);

  const parsed = ExtensionFieldsResponseCodec.safeParse(res);
  if (!parsed.success) {
    console.error("Failed to parse extension fields response", { error: z.prettifyError(parsed.error) });
    return [];
  }

  const { extensionFields } = parsed.data;

  return extensionFields.nodes;
}

export async function loadImportedItems({ silent = false } = {}) {
  if (!silent) {
    sharedStore.importedItems.loading = true;
  }

  let page = 1;
  let allNodes: ExtensionField[] = [];
  let nodes: ExtensionField[] = [];

  do {
    nodes = await fetchExtensionFields({ page, per: 500 });
    allNodes = allNodes.concat(nodes);
    page++;
  } while (nodes.length === 500);

  const updates = Object.fromEntries(
    allNodes.map(extensionField => [String(extensionField.value), extensionField.extensionFieldable]),
  );
  Object.assign(sharedStore.importedItems.value, updates);

  if (!silent) {
    sharedStore.importedItems.loading = false;
  }
}

async function loadDashboardViews(): Promise<View[]> {
  const raw = await getUserPreference(DASHBOARD_VIEWS);
  if (!raw) {
    return [];
  }
  const parsed = z.array(DashboardViewCodec).safeParse(raw);
  if (!parsed.success) {
    console.error("Failed to parse dashboard views, resetting to empty", z.prettifyError(parsed.error), raw);
    return [];
  }
  return parsed.data;
}

export async function addDashboardView({ id, title }: { id: number; title: string }) {
  const currentViews = sharedStore.dashboardViews.value || [];
  const existingView = currentViews.find(currentView => currentView.id === id);

  if (!existingView) {
    const newViews = (sharedStore.dashboardViews.value = [...currentViews, { id, title }]);

    await setUserPreference(DASHBOARD_VIEWS, newViews);
  }
}

export async function removeDashboardView(id: number) {
  const currentViews = sharedStore.dashboardViews.value || [];
  const newViews = (sharedStore.dashboardViews.value = observable(
    currentViews.filter(currentView => currentView.id !== id),
  ));

  // Optimistic save, return with new value immediately
  await setUserPreference(DASHBOARD_VIEWS, newViews);
}

export async function importItem(item: ZendeskItem) {
  const id = String(item.ticket.id);
  sharedStore.importing[id] = true;

  // Check if this specific ticket already has a linked feature
  const existingNodes = await fetchExtensionFields({ value: id });

  // If this ticket already has a feature, return it
  if (existingNodes.length > 0) {
    const existingFeature = existingNodes[0].extensionFieldable;
    sharedStore.importedItems.value[id] = existingFeature;
    sharedStore.importing[id] = false;
    return existingFeature;
  }

  const feature = new aha.models.Feature({
    name: item.subject,
    // @ts-expect-error description is typed as only accepting a Note, but string has been passed historically
    description: descriptionForItem(item),
    // @ts-expect-error Aha.Feature should accept a deep partial, but the typings are currently shallow
    team: { id: aha.project.id },
  });

  await feature.save({ query: feature.query.select("referenceNum") });
  await feature.setExtensionField(EXTENSION_ID, TICKET_FIELD, id);

  // @ts-expect-error we know feature matches FeatureReference here
  sharedStore.importedItems.value[id] = feature as FeatureReference;
  sharedStore.importing[id] = false;

  // Refresh cache in background to catch changes from other users
  loadImportedItems({ silent: true });

  return feature;
}

export async function loadViews(force = false) {
  const { views } = sharedStore;
  if (force || !views.value) {
    views.loading = true;

    const response = await zendeskFetch("/views", {}, { codec: ViewResponseCodec });
    views.value = response.views.filter(view => view.active);

    views.loading = false;
  }
}

export async function updateSetting<T>(
  key: string,
  mutatorOrValue: T | ((currentValue?: unknown) => T | Promise<T>),
  scope = "user",
) {
  const { settings } = sharedStore;
  const currentValue = settings[key];
  const newValue = observable(
    // @ts-expect-error mutateOrValue is a function, that'll do
    typeof mutatorOrValue === "function" ? await mutatorOrValue(currentValue) : mutatorOrValue,
  ) as T;
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

function populateUsers(users: User[]) {
  users.forEach(user => {
    sharedStore.users[user.id] = user;
  });
}

export async function loadViewData(id: number, options: { force?: boolean } = {}) {
  const { force = false } = options;
  if (force || !(id in sharedStore.viewData)) {
    if (!sharedStore.viewData[id]) {
      sharedStore.viewData[id] = { loading: true, data: null };
    } else {
      sharedStore.viewData[id].loading = true;
    }
    const maxPages = 10;
    let pageCount = 0;
    let nextPage: string | null = `/views/${id}/execute`;
    try {
      do {
        const data = await zendeskFetch(nextPage, {}, { codec: ViewDataCodec });
        populateUsers(data.users);
        if (pageCount === 0) {
          // Set viewData on first page, subsequent pages will append rows and users but other data should be the same so no need to reset
          sharedStore.viewData[id].data = data;
          // Set loading to false after first page, subsequent pages will append data, but we can start showing results immediately
          // So this is really "initial load" / we have enough data to show something, rather than "fully loaded"
          // worth it in order to give a responsive feel to loading, especially for larger views
          sharedStore.viewData[id].loading = false;
        } else {
          // Append rows and users to existing data
          sharedStore.viewData[id].data.rows = [...sharedStore.viewData[id].data.rows, ...data.rows];
        }
        nextPage = data.next_page;
        pageCount++;
      } while (nextPage && pageCount < maxPages);
    } finally {
      sharedStore.viewData[id].loading = false;
    }
  }
}

export async function refreshData() {
  sharedStore.refreshing = true;
  await Promise.all([
    ...sharedStore.dashboardViews.value.map(dashboardView => loadViewData(dashboardView.id, { force: true })),
    loadImportedItems(),
  ]).finally(() => {
    sharedStore.refreshing = false;
  });
}

export function setSearchTerm(term: string) {
  sharedStore.searchTerm = term;
}
