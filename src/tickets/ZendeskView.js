import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { loadViewData, sharedStore } from "../store";
import ItemImporter from "./ItemImporter";
import { EXTENSION_ID } from "../extension";

const ZendeskRow = ({ item }) => {
  const onOpen = event => {
    event.preventDefault();

    aha.drawer.showExtension(EXTENSION_ID, "ticket", { ticketId: item.ticket.id });
  };

  return (
    <tr className="zendesk-ticket">
      <td>
        <a
          onClick={onOpen}
          // target="_blank"
          // href={`https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`}
          // rel="noreferrer noopener"
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
  );
};

const ZendeskView = ({ dashboardView, data, view, onRemove }) => {
  const { settings } = sharedStore;

  let content;

  if (!data || data.loading) {
    loadViewData(dashboardView.id);
    content = (
      <div className="subsection" style={{ fontSize: 28, textAlign: "center" }}>
        <aha-spinner />
      </div>
    );
  } else {
    const items = data?.data?.rows || [];

    content = (
      <div className="subsection">
        {items.length ? (
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
                <ZendeskRow item={item} key={item.ticket.id} />
              ))}
            </tbody>
          </table>
        ) : (
          <p>There are no tickets in this view.</p>
        )}
      </div>
    );
  }

  return (
    <section>
      <div className="section__title">
        <aha-flex align-items="center" justify-content="space-between">
          <h2>{view.title}</h2>

          <aha-menu>
            <aha-button slot="button" type="attribute" size="small">
              <aha-icon icon="fa-solid fa-ellipsis"></aha-icon>
            </aha-button>
            <aha-button type="text" onClick={onRemove}>
              Remove
            </aha-button>
          </aha-menu>
        </aha-flex>
      </div>

      {content}
    </section>
  );
};

export default view(ZendeskView);
