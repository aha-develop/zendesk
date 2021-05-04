import React, { useEffect } from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import AddView from "./AddView";
import EmptyState from "./EmptyState";
import ZendeskView from "./ZendeskView";
import { loadData, removeDashboardView, sharedStore } from "../store";

const Dashboard = () => {
  const { dashboardViews, views, viewData } = sharedStore;

  useEffect(() => {
    loadData();
  });

  let content;

  if (views.loading || dashboardViews.loading) {
    return (
      <div style={{ fontSize: 36, justifyContent: "center", alignItems: "center" }}>
        <aha-spinner />
      </div>
    );
  } else if (dashboardViews.value.length === 0) {
    return <EmptyState />;
  } else {
    return (
      <div className="sections" style={{ alignItems: "center" }}>
        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          <AddView>
            <h5 style={{ margin: 0 }}>Zendesk views</h5>
          </AddView>
        </div>

        {dashboardViews.value.map(dashboardView => {
          const view = views.value.find(view => view.id === dashboardView.id);

          if (!view) {
            return null;
          }

          const data = viewData[dashboardView.id];

          return (
            <ZendeskView
              key={dashboardView.id}
              dashboardView={dashboardView}
              data={data}
              view={view}
              onRemove={() => removeDashboardView(dashboardView.id)}
            />
          );
        })}
      </div>
    );
  }
};

export default view(Dashboard);
