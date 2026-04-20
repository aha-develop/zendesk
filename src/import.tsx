import React from "react";
import { EXTENSION_ID, TICKET_FIELD, settings } from "./extension";
import { descriptionForItem, zendeskFetch } from "./zendesk";
import { ZendeskRecord, TicketsCodec, ZendeskRecordCodec, ViewResponseCodec } from "./types";
import Card from "./components/Card";

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
importer.on({ action: "filterValues" }, async ({ filterName }) => {
  switch (filterName) {
    case "view": {
      const response = await zendeskFetch("/views", {}, { codec: ViewResponseCodec });
      return response.views.filter(view => view.active).map(view => ({ value: view.id, text: view.title }));
    }
  }
});

// Return an array of records from a paginated list of import candidates.
importer.on(
  { action: "listCandidates" },
  async ({ filters }): Promise<{ records: ZendeskRecord[]; nextPage: string | null }> => {
    if (!filters.view) {
      return { records: [], nextPage: null };
    }

    const response = await zendeskFetch(`/views/${filters.view}/execute?include=users`);
    const parsed = TicketsCodec.safeParse(response);
    if (!parsed.success) {
      console.error("Failed to parse tickets response", parsed.error);
      return { records: [], nextPage: null };
    }
    const data = parsed.data;

    return {
      records: data.rows.map(item => ({
        uniqueId: String(item.ticket.id),
        identifier: String(item.ticket.id),
        name: item.subject,
        url: `https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`,
        description: descriptionForItem(item),
        status: item.ticket.status,
        assigneeName: data.users.find(user => user.id === item.assignee_id)?.name || "Unassigned",
      })),
      nextPage: null,
    };
  },
);

importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }) => {
  // Save reference to ticket for the full page screen
  ahaRecord.setExtensionField(EXTENSION_ID, TICKET_FIELD, importRecord.identifier);

  ahaRecord.description = importRecord.description;
  ahaRecord.save();
});

// This is called from app/assets/components/record_importer/Card.tsx
importer.on({ action: "renderRecord" }, async ({ record }) => {
  const parsed = ZendeskRecordCodec.safeParse(record);
  if (!parsed.success) {
    console.error("Failed to parse record", parsed.error);
    return null;
  }
  return <Card record={parsed.data} />;
});

importer.on({ filter: "renderRecordWrapped" }, () => false);
