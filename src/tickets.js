import React from "https://cdn.skypack.dev/react";
import { render, unmountComponentAtNode } from "https://cdn.skypack.dev/react-dom";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { authenticateUser, checkAuth, sharedStore } from "./store";
import Dashboard from "./tickets/Dashboard";
import NotConfigured from "./tickets/NotConfigured";
import NotAuthenticated from "./tickets/NotAuthenticated";
import Styles from "./styles";

function tickets(container, extensionProps) {
  const App = view(props => {
    const { authenticatedUser, loadingAuth, settings } = sharedStore;

    let content;

    if (!settings.subdomain) {
      content = <NotConfigured extensionId={props.extensionId} />;
    } else if (!authenticatedUser) {
      content = <NotAuthenticated />;
    } else {
      content = <Dashboard />;
    }

    return (
      <div>
        <Styles />

        <div className="page">
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
          </div>
          {content}
        </div>
      </div>
    );
  });

  // Load existing auth
  checkAuth();

  return <App {...extensionProps} />;
}

aha.on("tickets", tickets);
