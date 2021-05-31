import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { sharedStore } from "../store";
import ItemImporter from "./ItemImporter";

const TicketsTable = ({ items }) => {
  if (items?.length) {
    const { settings } = sharedStore;

    return (
      <table className="record-table record-table--settings-page">
        <thead>
          <tr>
            <th>Ticket name</th>
            <th>Customer</th>
            <th>Assignee</th>
            <th>Feature</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.ticket.id} className="zendesk-ticket">
              <td>
                <a
                  target="_blank"
                  href={`https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`}
                  rel="noreferrer noopener"
                >
                  {item.subject}
                </a>
              </td>
              <td>{sharedStore.users[item.requester_id]?.name}</td>
              <td>{sharedStore.users[item.assignee_id]?.name}</td>
              <td>
                <ItemImporter item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return <p>There are no tickets in this view.</p>;
  }
};

export default view(TicketsTable);
