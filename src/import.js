import { settings } from "./extension";
import { zendeskFetch } from "./zendesk";

const importer = aha.getImporter("aha-develop.zendesk.import");

// Return an array of records from a paginated list of import candidates.
importer.on({ action: "listCandidates" }, async ({ filters, nextPage }) => {
  if (!filters.view) {
    return { records: [], nextPage: null };
  }

  const response = await zendeskFetch(`/views/${filters.view}/execute`);

  return {
    records: response.rows.map(item => ({
      uniqueId: item.ticket.id,
      identifier: item.ticket.id,
      name: item.subject,
      url: `https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`,
    })),
    nextPage: null,
  };
});

// Return the available filters
importer.on(
  {
    action: "listFilters",
  },
  async () => {
    return { view: { title: "View", required: true, type: "select" } };
  },
);

// For a particular filter, when it is dropped-down, provide a list of the possible values.
importer.on({ action: "filterValues" }, async ({ filter, filters }) => {
  let values = [];
  switch (filter) {
    case "view":
      const response = await zendeskFetch("/views");
      return response.views.filter(view => view.active).map(view => ({ id: view.id, name: view.title }));
  }
});
