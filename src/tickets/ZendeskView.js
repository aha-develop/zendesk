import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { sharedStore } from "../store";

const ZendeskView = ({ data, view, onRemove }) => {
  const { settings } = sharedStore;
  const items = data?.data?.rows || [];

  return (
    <div>
      <h3>
        {view.title}
        <button onClick={onRemove}>x</button>
      </h3>
      {items.length ? (
        <ul>
          {items.map(item => (
            <li key={item.ticket.id}>
              <a
                target="_blank"
                href={`https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`}
                rel="noreferrer"
              >
                {item.subject}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no tickets in this view.</p>
      )}
    </div>
  );
};

export default view(ZendeskView);
