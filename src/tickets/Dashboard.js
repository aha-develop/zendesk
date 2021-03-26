import React, { useCallback, useEffect } from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import ZendeskView from "./ZendeskView";
import {
  addDashboardView,
  loadData,
  loadViewData,
  observable,
  removeDashboardView,
  sharedStore,
  updateSetting,
} from "../store";

const Dashboard = () => {
  const { dashboardViews, views, viewData } = sharedStore;

  useEffect(() => {
    loadData();
  });

  return (
    <div>
      {views.value &&
        !dashboardViews.loading &&
        dashboardViews.value?.map(dashboardView => {
          const view = views.value.find(view => view.id === dashboardView.id);

          if (!view) {
            return null;
          }

          const data = viewData[dashboardView.id];
          if (!data || data.loading) {
            loadViewData(dashboardView.id);

            return (
              <div key={dashboardView.id}>
                <h3>{dashboardView.title}</h3>
                <p>Loading…</p>
              </div>
            );
          }

          return (
            <ZendeskView
              key={dashboardView.id}
              data={data}
              view={view}
              onRemove={() => removeDashboardView(dashboardView.id)}
            />
          );
        })}
      <h3>Add view</h3>
      <div>
        <select
          disabled={views.loading}
          value={""}
          onChange={event => {
            if (event.target.value) {
              const viewId = parseInt(event.target.value, 10);
              const view = views.value.find(view => view.id === viewId);

              if (view) {
                addDashboardView(view);
              }

              event.target.value = "";
            }
          }}
        >
          <option value="">{views.loading ? "Loading views…" : "Add a view…"}</option>
          {views.value &&
            !dashboardViews.loading &&
            views.value
              .filter(view => !dashboardViews.value.find(dashboardView => dashboardView.id === view.id))
              .map(view => (
                <option key={view.id} value={view.id}>
                  {view.title}
                </option>
              ))}
        </select>
      </div>
    </div>
  );
};

export default view(Dashboard);
