import React, { useCallback, useEffect, useState } from "https://cdn.skypack.dev/react";
import ReactDOM, { render, unmountComponentAtNode } from "https://cdn.skypack.dev/react-dom";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { authenticateUser, checkAuth, loadViewData, loadViews, observable, sharedStore, updateSetting } from "./store";
import { zendeskFetch } from "./zendesk";

function tickets(container, props) {
  const Configure = view(() => {
    const { authenticatedUser, loadingAuth, settings } = sharedStore;

    return (
      <div>
        <div>
          Zendesk domain: <input type="text" value={settings.subdomain} disabled />
          <a href={`/settings/account/extensions`} target="_blank">
            edit
          </a>
        </div>

        {!authenticatedUser && (
          <div>
            Authenticate:{" "}
            <button disabled={loadingAuth} onClick={() => authenticateUser()}>
              {loadingAuth ? "Authenticating" : "Authenticate"}
            </button>
          </div>
        )}
      </div>
    );
  });

  const ZendeskView = view(({ data, view, onRemove }) => {
    const { dashboardViews, settings } = sharedStore;
    const items = data?.data?.rows || [];

    return (
      <div>
        {" "}
        <h3>
          {view.title}
          <button onClick={onRemove}>x</button>
        </h3>
        {items.length ? (
          <ul>
            {items.map(item => (
              <li key={item.ticket.id}>
                <a target="_blank" href={`https://${settings.subdomain}.zendesk.com/agent/tickets/${item.ticket.id}`}>
                  {item.subject}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>There are no tickets in this view.</p>
        )}
      </div>
    );
  });

  const Dashboard = view(() => {
    const { dashboardViews, settings, views, viewData } = sharedStore;

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

            return (
              <ZendeskView key={dashboardView} data={data} view={view} onRemove={() => removeView(dashboardView)} />
            );
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
  });

  const App = view(props => {
    const { authenticatedUser, dashboardViews, settings } = sharedStore;
    let Component = Configure;

    if (authenticatedUser && settings.subdomain) {
      Component = Dashboard;
    }

    return (
      <div>
        <h1>Zendesk</h1>

        {authenticatedUser && <div>Authenticated as {authenticatedUser.name}</div>}

        <pre>{JSON.stringify(dashboardViews)}</pre>

        <Component />
      </div>
    );
  });

  render(<App {...props} />, container);

  // Load existing auth
  checkAuth();

  return () => {
    unmountComponentAtNode(container);
  };
}

aha.on("tickets", tickets);
