import moment from "moment";
import React from "react";
import ItemImporter from "../components/ItemImporter";
import { Column, Group, ViewData, ZendeskItem } from "../types";

export function idToData(columnId: string | number | null, viewData: ViewData) {
  return (item: ZendeskItem): string | null | undefined => {
    if (!columnId) return null;

    switch (columnId) {
      case "created":
      case "updated":
        const value = item[columnId];
        return typeof value === "string" || typeof value === "number" ? moment(value).fromNow() : null;
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
