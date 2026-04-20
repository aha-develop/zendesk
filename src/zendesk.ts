import { z } from "zod";
import { settings } from "./extension";
import { ZendeskItem } from "./types";

interface ZendeskFetchOptions {
  method?: string;
  authOptions?: Record<string, unknown>;
  _retryCount?: number;
}

export async function zendeskFetch<T extends z.ZodType>(
  path: string,
  data: Record<string, unknown>,
  options: ZendeskFetchOptions & { codec: T },
): Promise<z.infer<T>>;
export async function zendeskFetch(
  path: string,
  data?: Record<string, unknown>,
  options?: ZendeskFetchOptions,
): Promise<unknown>;
export async function zendeskFetch(
  path: string,
  data: Record<string, unknown> = {},
  options: ZendeskFetchOptions & { codec?: z.ZodType } = {},
) {
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

  const baseUrl = `https://${subdomain}.zendesk.com/api/v2`;
  const url = path.startsWith(baseUrl) ? path : `${baseUrl}${path}`;

  const response = await fetch(url, {
    method,
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.token}`,
    },
    body: ["GET", "HEAD"].includes(method) ? null : JSON.stringify(data),
  });

  const retryCount = options._retryCount ?? 0;

  // Rate limit handling - https://developer.zendesk.com/documentation/api-basics/best-practices/best-practices-for-avoiding-rate-limiting/#using-rate-limit-headers-in-your-application
  if (response.status === 429 && retryCount < 10) {
    // Annoyingly Retry-After isn't in the Access-Control-Expose-Headers currently so chances are you won't have a value for this
    // Default seems to be around 35 seconds
    const wait = response.headers.get("Retry-After") ?? "5";
    console.log(`Rate limited by Zendesk API. Retrying after ${wait} seconds...`);
    await new Promise(resolve => setTimeout(resolve, parseInt(wait) * 1000));
    return zendeskFetch(path, data, { ...options, _retryCount: retryCount + 1 });
  }

  if (response.status !== 200) {
    throw new Error(`Zendesk request failed: ${response.status} ${response.statusText}: ${await response.text()}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  if (options.codec) {
    try {
      return options.codec.parse(result);
    } catch (err) {
      throw new Error(`Failed to parse Zendesk response: ${z.prettifyError(err)}`);
    }
  }

  return result;
}

export const descriptionForItem = (item: ZendeskItem) => {
  const { ticket } = item;

  return [
    `<p><a href="https://${settings.subdomain}.zendesk.com/agent/tickets/${ticket.id}">Imported from Zendesk (Ticket #${ticket.id})</a></p>`,
    "<h3>Last comment</h3>",
    (ticket.last_comment ? ticket.last_comment.body.replace(/\n\n/g, "<br>") : "") || "<p>No comment</p>",
    "<h3>Ticket content</h3>",
    ticket.description.replace(/\n\n/g, "<br>"),
  ].join("");
};
