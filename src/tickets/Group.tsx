import React from "react";
import { columnFormatter } from "./columnFormatter";
import { ZendeskItem } from "../types";

export const Group: React.FC<{
  items: ZendeskItem[];
  groupName: string;
  Formatter: ReturnType<typeof columnFormatter>;
  formatters: ReturnType<typeof columnFormatter>[];
}> = ({ items, groupName, Formatter, formatters }) => {
  return (
    <>
      {groupName && (
        <tr className="zendesk-ticket-group">
          <td
            colSpan={formatters.length}
            style={{
              backgroundColor: "var(--theme-tertiary-background)",
            }}
          >
            <Formatter item={items[0]} />
          </td>
        </tr>
      )}
      {items.map((row, rdx) => (
        <tr key={row.ticket.id} className="zendesk-ticket">
          {formatters.map((Formatter, cdx) => (
            <td key={`${rdx}-${cdx}`} colSpan={cdx === formatters.length - 1 ? 2 : 1}>
              <Formatter item={row} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
