export const EXTENSION_ID = "aha-develop.zendesk";

const baseSettings = aha.settings.get(EXTENSION_ID) as Aha.Settings | undefined;

export type Settings = Aha.Settings & { subdomain: string };

export const settings: Settings = {
  ...baseSettings,
  subdomain: (baseSettings?.subdomain ? String(baseSettings.subdomain) : "").trim(),
};

// Fields used on records
export const TICKET_FIELD = "zendesk.ticket";
