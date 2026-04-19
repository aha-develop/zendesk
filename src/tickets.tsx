import React from "react";
import { view } from "@aha-app/react-easy-state";
import { checkAuth, refreshData, sharedStore } from "./store";
import Dashboard from "./tickets/Dashboard";
import NotConfigured from "./components/NotConfigured";
import NotAuthenticated from "./components/NotAuthenticated";
import Styles from "./styles";
import AddView from "./tickets/AddView";
import { Search } from "./tickets/Search";

const tickets: Aha.RenderExtension = (extensionProps, { identifier }) => {
  const App = view(() => {
    const { authenticatedUser, settings, refreshing } = sharedStore;

    return (
      <div>
        <Styles />
        <div className="page-nav">
          <div className="page-nav__row  page-nav__row--justify-left page-nav__row--align-top">
            <div className="page-nav__cell page-nav__cell--grow-1">
              <h1>Zendesk Tickets</h1>
            </div>
            {authenticatedUser && (
              <div className="page-nav__cell page-nav__cell--justify-right">
                <div style={{ textAlign: "right" }}>
                  <strong>Authenticated as</strong>
                  <br />
                  {authenticatedUser.name}
                </div>
              </div>
            )}
          </div>
          {authenticatedUser && (
            <div className="page-nav__row">
              <div className="page-nav__cell">
                <AddView>
                  <h5 style={{ margin: 0 }}>Zendesk Views</h5>
                </AddView>
              </div>
              <div className="page-nav__cell">
                <aha-button kind="link" disabled={refreshing || null} onClick={refreshData}>
                  {refreshing ? <aha-spinner></aha-spinner> : <i className="fa-regular fa-refresh" />}
                  <span style={{ marginLeft: ".75ch" }}>{refreshing ? "Refreshing…" : "Refresh views"}</span>
                </aha-button>
              </div>
              <div className="page-nav__cell  page-nav__cell--justify-right">
                <Search />
              </div>
            </div>
          )}
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

  checkAuth();

  return <App />;
};

aha.on("tickets", tickets);
