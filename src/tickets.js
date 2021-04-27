import React from "https://cdn.skypack.dev/react";
import { render, unmountComponentAtNode } from "https://cdn.skypack.dev/react-dom";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { authenticateUser, checkAuth, sharedStore } from "./store";
import Dashboard from "./tickets/Dashboard";
import Styles from "./styles";

function tickets(container, extensionProps) {
  const App = view(props => {
    const { authenticatedUser, loadingAuth, settings } = sharedStore;

    let content;

    if (!settings.subdomain) {
      content = (
        <div className="sections" style={{ justifyContent: "center" }}>
          <section style={{ justifyContent: "center", alignItems: "center" }}>
            <p>Please update your extension settings to provide a Zendesk subdomain.</p>

            <p>
              <aha-button
                href={`/settings/account/extensions/${props.extensionId || ""}`}
                type="primary"
                target="_blank"
              >
                Configure Extension
              </aha-button>
            </p>
          </section>
        </div>
      );
    } else if (!authenticatedUser) {
      content = (
        <div className="sections" style={{ justifyContent: "center" }}>
          <section style={{ justifyContent: "center", alignItems: "center" }}>
            <aha-button disabled={loadingAuth || null} onClick={() => authenticateUser()}>
              {loadingAuth ? "Authenticating" : "Authenticate with Zendesk"}
            </aha-button>
          </section>
        </div>
      );
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
