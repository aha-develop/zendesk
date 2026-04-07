export const EXTENSION_ID = "aha-develop.zendesk";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

const baseSettings = aha.settings.get(EXTENSION_ID) as undefined | Aha.Settings | Record<string, JSONValue>;
export const settings: Record<string, JSONValue> & { subdomain: string } = {
  ...baseSettings,
  subdomain: (baseSettings.subdomain ? String(baseSettings.subdomain) : "").trim(),
};

// Fields used on records
export const TICKET_FIELD = "zendesk.ticket";
