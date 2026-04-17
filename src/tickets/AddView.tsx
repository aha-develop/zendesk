import { view } from "@aha-app/react-easy-state";
import React from "react";
import { addDashboardView, sharedStore } from "../store";

const AddView = ({ children }: { children?: React.ReactNode }) => {
  const { dashboardViews, views } = sharedStore;
  const [viewId, setViewId] = React.useState("");

  return (
    <aha-split align="center">
      {children}

      <select
        name="viewId"
        disabled={views.loading}
        value={viewId}
        onChange={e => setViewId(e.target.value)}
        style={{ margin: 0 }}
      >
        <option value="">{views.loading ? "Loading views…" : "Select view"}</option>
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

      <aha-button
        kind="primary"
        onClick={() => {
          if (viewId) {
            const viewIdInt = parseInt(viewId, 10);
            const view = views.value.find(view => view.id === viewIdInt);

            if (view) {
              addDashboardView(view);
            }

            setViewId("");
          }
        }}
      >
        Add
      </aha-button>
    </aha-split>
  );
};

export default view(AddView);
