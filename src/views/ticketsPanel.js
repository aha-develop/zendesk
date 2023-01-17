import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { zendeskFetch } from "../zendesk";
import { checkAuth, loadData, loadViewData, sharedStore } from "../store";
import NotConfigured from "../components/NotConfigured";
import NotAuthenticated from "../components/NotAuthenticated";
import TicketsTable from "../components/TicketsTable";

const panel = aha.getPanel("aha-develop.zendesk", "ticketsPanel", { name: "Zendesk tickets" });

const Tickets = view(({ data, view }) => {
  if (!data || data.loading) {
    loadViewData(view.id);
    return <aha-spinner />;
  }

  const items = data?.data?.rows || [];
  return <TicketsTable items={items} />;
});

const TicketsPanel = view(({ identifier, panel }) => {
  const panelSettings = panel.settings;
  const { authenticatedUser, settings, views, viewData } = sharedStore;

  if (!settings.subdomain) {
    return <NotConfigured identifier={identifier} />;
  } else if (!authenticatedUser) {
    return <NotAuthenticated />;
  } else if (views.loading) {
    return (
      <div className="page-content empty-state">
        <div className="empty-state__content">
          <div style={{ fontSize: 36, justifyContent: "center", alignItems: "center" }}>
            <aha-spinner />
          </div>
        </div>
      </div>
    );
  } else if (panelSettings.view) {
    const view = views.value.find(view => String(view.id) === panelSettings.view);

    if (!view) {
      return (
        <div>
          <p>Unable to find view. Please check settings.</p>
        </div>
      );
    }

    const data = viewData[view.id];
    return <Tickets data={data} view={view} />;
  }

  return (
    <div>
      <div>Please select a view in the panel settings.</div>
    </div>
  );
});

// Render the panel
panel.on("render", ({ props }, { identifier }) => {
  // Load existing auth
  checkAuth();
  loadData();

  const { panel } = props;

  return <TicketsPanel panel={panel} identifier={identifier} />;
});

// Settings
panel.on({ action: "settings" }, () => {
  return [
    {
      key: "view",
      type: "Select",
      title: "View",
      updateTitle: true,
      async options() {
        const response = await zendeskFetch("/views");
        return response.views
          .filter(view => view.active)
          .map(view => {
            const { id, title } = view;
            return { value: id, text: title };
          });
      },
    },
  ];
});
