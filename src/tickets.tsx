import React from "react";
import { view } from "@aha-app/react-easy-state";
import { checkAuth, sharedStore } from "./store";
import Dashboard from "./tickets/Dashboard";
import NotConfigured from "./components/NotConfigured";
import NotAuthenticated from "./components/NotAuthenticated";
import Styles from "./styles";

const tickets: Aha.RenderExtension = (extensionProps, { identifier }) => {
  const App = view(() => {
    const { authenticatedUser, settings } = sharedStore;
    console.log("Shared store", sharedStore);

    return (
      <div>
        <Styles />
        <div className="page-nav">
          <div className="page-nav__row  page-nav__row--justify-left page-nav__row--align-top">
            <div className="page-nav__cell page-nav__cell--grow-1">
              <h1>Zendesk Tickets</h1>
            </div>
            {authenticatedUser && (
              <div className="page-nav__cell">
                <div style={{ textAlign: "right" }}>
                  <strong>Authenticated as</strong>
                  <br />
                  {authenticatedUser.name}
                </div>
              </div>
            )}
          </div>
          <div className="page-nav__row"></div>
        </div>
        <div className="sidebar-layout  sidebar-layout--gray-content">
          <div className="sidebar-layout__content">
            {!settings.subdomain ? (
              <NotConfigured identifier={identifier} />
            ) : !authenticatedUser ? (
              <NotAuthenticated />
            ) : (
              <Dashboard />
            )}
          </div>
        </div>
      </div>
    );
  });

  console.log("Render tickets extension", { identifier });
  // Load existing auth
  checkAuth();

  return <App />;
};

aha.on("tickets", tickets);
