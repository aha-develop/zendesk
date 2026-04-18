import React, { useEffect } from "react";
import { view } from "@aha-app/react-easy-state";
import AddView from "./AddView";
import EmptyState from "./EmptyState";
import ZendeskView from "./ZendeskView";
import { loadData, refreshData, removeDashboardView, sharedStore } from "../store";

const Dashboard = () => {
  const { dashboardViews, refreshing, views } = sharedStore;

  useEffect(() => {
    loadData();
  }, []);

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
      <div className="sections" style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
        <aha-panel>
          <aha-split slot="heading">
            <aha-button kind="link" loading={refreshing || null} onClick={refreshData}>
              <span slot="prefix">
                {refreshing ? <aha-spinner></aha-spinner> : <aha-icon icon="fa-regular fa-refresh" />}
              </span>
              <span style={{ marginLeft: ".75ch" }}>{refreshing ? "Refreshing…" : "Refresh views"}</span>
            </aha-button>
            <AddView>
              <h5 style={{ margin: 0 }}>Zendesk views</h5>
            </AddView>
          </aha-split>
        </aha-panel>

        {dashboardViews.value.map(dashboardView => {
          const view = views.value.find(view => view.id === dashboardView.id);

          if (!view) {
            return null;
          }

          return (
            <ZendeskView key={dashboardView.id} view={view} onRemove={() => removeDashboardView(dashboardView.id)} />
          );
        })}
      </div>
    );
  }
};

export default view(Dashboard);
