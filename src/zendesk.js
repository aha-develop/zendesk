import { settings } from "./extension";

export async function zendeskFetch(path, data = {}, options = {}) {
  const { method = "GET", authOptions = {} } = options;

  const { subdomain } = settings;

  if (!subdomain) {
    throw new aha.ConfigError("Missing subdomain. Please configure a subdomain in the extension settings.");
  }

  const authData = await aha.auth("zendesk", {
    useCachedRetry: true,
    ...authOptions,
    parameters: { subdomain },
  });

  const response = await fetch(`https://${subdomain}.zendesk.com/api/v2${path}`, {
    method,
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.token}`,
    },
    body: ["GET", "HEAD"].includes(method) ? null : JSON.stringify(data),
  });

  if (response.status !== 200) {
    throw new Error(`Zendesk request failed: ${response.status} ${response.statusText}: ${await response.text()}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result;
}

export const descriptionForItem = item => {
  const { ticket } = item;

  return [
    `<p><a href="https://${settings.subdomain}.zendesk.com/agent/tickets/${ticket.id}">Imported from Zendesk (Ticket #${ticket.id})</a></p>`,
    "<h3>Last comment</h3>",
    (ticket.last_comment ? ticket.last_comment.body.replace(/\n\n/g, "<br>") : "") || "<p>No comment</p>",
    "<h3>Ticket content</h3>",
    ticket.description.replace(/\n\n/g, "<br>"),
  ].join("");
};
