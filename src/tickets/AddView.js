import React, { useRef } from "react";
import { view } from "@aha-app/react-easy-state";
import { addDashboardView, sharedStore } from "../store";

const AddView = ({ children }) => {
  const selectRef = useRef();
  const { dashboardViews, views } = sharedStore;

  return (
    <aha-flex gap="1rem" align-items="center" justify-content="center">
      {children}

      <div>
        <select ref={selectRef} disabled={views.loading}>
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
          Add
        </aha-button>
      </div>
    </aha-flex>
  );
};

export default view(AddView);
