import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { loadViewData, sharedStore } from "../store";
import TicketsTable from "../components/TicketsTable";

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
        <TicketsTable items={items} />
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
