import React from "react";
import { view } from "@aha-app/react-easy-state";
import { zendeskFetch } from "../zendesk";
import { checkAuth, loadData, sharedStore } from "../store";
import NotConfigured from "../components/NotConfigured";
import NotAuthenticated from "../components/NotAuthenticated";
import TicketsTable from "../components/TicketsTable";
import { View, ViewResponseCodec } from "../types";
import { useViewData } from "../lib/useViewData";

const panel = aha.getPanel("aha-develop.zendesk", "ticketsPanel", { name: "Zendesk tickets" });

const Tickets = view(({ view }: { view: View }) => {
  const { loading, viewData } = useViewData(view);

  return loading || !viewData ? <aha-spinner /> : <TicketsTable viewData={viewData} view={view} />;
});

const TicketsPanel = view(
  ({ identifier, panel }: { identifier: string; panel: { settings: Record<string, unknown> } }) => {
    const panelSettings = panel.settings;
    const { authenticatedUser, settings, views } = sharedStore;

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

      return <Tickets view={view} />;
    }

    return (
      <div>
        <div>Please select a view in the panel settings.</div>
      </div>
    );
  },
);

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
        const response = await zendeskFetch("/views", {}, { codec: ViewResponseCodec });
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
