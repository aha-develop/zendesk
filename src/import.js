import { EXTENSION_ID, TICKET_FIELD, settings } from "./extension";
import { zendeskFetch, descriptionForItem } from "./zendesk";

const importer = aha.getImporter("aha-develop.zendesk.import");

importer.on(
  {
    action: "auth",
  },
  async () => {
    // Trigger API request to force authentication
    await zendeskFetch("/users/me");
  },
);

// Return the available filters
importer.on(
  {
    action: "listFilters",
  },
  async () => {
    // Trigger API request to force authentication
    await zendeskFetch("/users/me");

    return { view: { title: "View", required: true, type: "select" } };
  },
);

// For a particular filter, when it is dropped-down, provide a list of the possible values.
importer.on({ action: "filterValues" }, async ({ filterName, filters }) => {
  switch (filterName) {
    case "view": {
      const response = await zendeskFetch("/views");
      return response.views.filter(view => view.active).map(view => ({ value: view.id, text: view.title }));
    }
  }
});

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
      description: descriptionForItem(item),
    })),
    nextPage: null,
  };
});

importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }) => {
  // Save reference to ticket for the full page screen
  ahaRecord.setExtensionField(EXTENSION_ID, TICKET_FIELD, importRecord.identifier);

  ahaRecord.description = importRecord.description;
  ahaRecord.save();
});
