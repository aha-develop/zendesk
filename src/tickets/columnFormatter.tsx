import React from "react";
import ItemImporter from "../components/ItemImporter";
import { Column, Group, ViewData, ZendeskItem } from "../types";

function timeAgo(value: string | number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffInSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) return rtf.format(diffInSeconds, "seconds");
  if (absDiff < 3600) return rtf.format(Math.round(diffInSeconds / 60), "minutes");
  if (absDiff < 86400) return rtf.format(Math.round(diffInSeconds / 3600), "hours");
  if (absDiff < 86400 * 30) return rtf.format(Math.round(diffInSeconds / 86400), "days");
  if (absDiff < 86400 * 365) return rtf.format(Math.round(diffInSeconds / (86400 * 30)), "months");
  return rtf.format(Math.round(diffInSeconds / (86400 * 365)), "years");
}

export function idToData(columnId: string | number | null, viewData: ViewData) {
  return (item: ZendeskItem): string | null | undefined => {
    if (!columnId) return null;

    switch (columnId) {
      case "created":
      case "updated":
        const value = item[columnId];
        return typeof value === "string" || typeof value === "number" ? timeAgo(value) : null;
      case "requester":
      case "assignee":
        const user_id = item[`${columnId}_id`];
        const user = viewData.users?.find(u => u.id === user_id);

        return user?.name;
      case "custom_status_id":
        const status = viewData.custom_statuses?.find(s => s.id === item.custom_status_id);

        return status?.name as string | undefined;
    }

    return columnId in item ? String(item[columnId]) : null;
  };
}

export function columnFormatter(
  column: Column | Group | null,
  viewData: ViewData,
  subdomain: string,
): React.FC<{ item: ZendeskItem }> {
  if (!column) return () => null;

  if (column.id === "__aha_feature") {
    // eslint-disable-next-line react/display-name
    return ({ item }) => {
      return <ItemImporter item={item} />;
    };
  }

  const idTransformer = idToData(column.id, viewData);

  switch (column.id) {
    case "ticket_id":
    case "subject":
      // eslint-disable-next-line react/display-name
      return ({ item }) => (
        <a
          target="_blank"
          href={aha.sanitizeUrl(`https://${subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`)}
          rel="noreferrer noopener"
        >
          {idTransformer(item)}
        </a>
      );
  }

  // eslint-disable-next-line react/display-name
  return ({ item }) => <>{idTransformer(item)}</>;
}
