import React, { useCallback, useEffect, useRef } from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import ZendeskView from "./ZendeskView";
import { addDashboardView, loadData, observable, removeDashboardView, sharedStore, updateSetting } from "../store";

const Dashboard = () => {
  const { dashboardViews, views, viewData } = sharedStore;

  const selectRef = useRef();
  useEffect(() => {
    loadData();
  });

  return (
    <div className="sections" style={{ justifyContent: "center" }}>
      <section>
        {views.value && !dashboardViews.loading && dashboardViews.value ? (
          dashboardViews.value.map(dashboardView => {
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
          })
        ) : (
          <div style={{ fontSize: 36, justifyContent: "center", alignItems: "center" }}>
            <aha-spinner></aha-spinner>
          </div>
        )}
      </section>

      <section className="sidebar">
        <h3>Add view</h3>
        <div>
          <select ref={selectRef} disabled={views.loading}>
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

        <div>
          <aha-button
            onClick={() => {
              if (selectRef.current?.value) {
                const viewId = parseInt(selectRef.current.value, 10);
                const view = views.value.find(view => view.id === viewId);

                if (view) {
                  addDashboardView(view);
                }

                selectRef.current.value = "";
              }
            }}
            type="primary"
          >
            Add view
          </aha-button>
        </div>
      </section>
    </div>
  );
};

export default view(Dashboard);
