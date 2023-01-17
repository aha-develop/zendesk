import React, { useEffect } from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import AddView from "./AddView";
import EmptyState from "./EmptyState";
import ZendeskView from "./ZendeskView";
import { loadData, refreshData, removeDashboardView, sharedStore } from "../store";

const Dashboard = () => {
  const { dashboardViews, refreshing, views, viewData } = sharedStore;

  useEffect(() => {
    loadData();
  });

  if (views.loading || dashboardViews.loading) {
    return (
      <div className="page-content empty-state">
        <div className="empty-state__content">
          <div style={{ fontSize: 36, justifyContent: "center", alignItems: "center" }}>
            <aha-spinner />
          </div>
        </div>
      </div>
    );
  } else if (dashboardViews.value.length === 0) {
    return <EmptyState />;
  } else {
    return (
      <div className="sections" style={{ alignItems: "center" }}>
        <aha-flex gap="1rem" align-items="baseline" justify-content="space-between">
          <aha-button kind="link" loading={refreshing || null} onClick={refreshData}>
            <span slot="prefix">
              {refreshing ? <aha-spinner></aha-spinner> : <aha-icon icon="fa-regular fa-refresh" />}
            </span>
            <span style={{ marginLeft: ".75ch" }}>{refreshing ? "Refreshing…" : "Refresh views"}</span>
          </aha-button>
          <AddView>
            <h5 style={{ margin: 0 }}>Zendesk views</h5>
          </AddView>
        </aha-flex>

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
