import React, { useCallback, useEffect } from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import ZendeskView from "./ZendeskView";
import { loadViewData, loadViews, observable, sharedStore, updateSetting } from "./store";

const Dashboard = () => {
  const { dashboardViews, views, viewData } = sharedStore;

  useEffect(() => {
    loadViews();
  });

  const removeView = useCallback(removeView => {
    const newValue = (sharedStore.dashboardViews = observable(
      dashboardViews.filter(dashboardView => dashboardView !== removeView),
    ));

    updateSetting("dashboardViews", newValue);
  });

  return (
    <div>
      {views.value &&
        dashboardViews?.map(dashboardView => {
          const view = views.value.find(view => view.id === dashboardView);

          if (!view) {
            return null;
          }

          const data = viewData[dashboardView];
          if (!data || data.loading) {
            loadViewData(dashboardView);

            return (
              <div key={dashboardView}>
                <h3>Loading…</h3>
              </div>
            );
          }

          return <ZendeskView key={dashboardView} data={data} view={view} onRemove={() => removeView(dashboardView)} />;
        })}
      <h3>Add view</h3>
      <div>
        <select
          disabled={views.loading}
          value={""}
          onChange={event => {
            if (event.target.value) {
              const view = parseInt(event.target.value, 10);
              const newValue = (sharedStore.dashboardViews = observable([...dashboardViews, view]));

              updateSetting("dashboardViews", newValue);
              event.target.value = "";
            }
          }}
        >
          <option value="">{views.loading ? "Loading views…" : "Add a view…"}</option>
          {views.value &&
            views.value
              .filter(view => !dashboardViews?.includes(view.id))
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
