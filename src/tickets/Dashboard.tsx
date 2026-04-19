import React, { useEffect } from "react";
import { view } from "@aha-app/react-easy-state";
import EmptyState from "./EmptyState";
import ZendeskView from "./ZendeskView";
import { loadData, removeDashboardView, sharedStore } from "../store";

const Dashboard = () => {
  const { dashboardViews, views } = sharedStore;

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
      <aha-stack>
        {dashboardViews.value.map(dashboardView => {
          const view = views.value.find(view => view.id === dashboardView.id);

          if (!view) {
            return null;
          }

          return (
            <ZendeskView key={dashboardView.id} view={view} onRemove={() => removeDashboardView(dashboardView.id)} />
          );
        })}
      </aha-stack>
    );
  }
};

export default view(Dashboard);
