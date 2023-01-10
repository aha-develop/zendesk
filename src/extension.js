export const EXTENSION_ID = "aha-develop.zendesk";

const baseSettings = aha.settings.get(EXTENSION_ID);
export const settings = {
  ...baseSettings,
  subdomain: (baseSettings.subdomain ?? "").trim(),
};

// Fields used on records
export const TICKET_FIELD = "zendesk.ticket";
