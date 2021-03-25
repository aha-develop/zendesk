import React from "https://cdn.skypack.dev/react";
import { render, unmountComponentAtNode } from "https://cdn.skypack.dev/react-dom";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { checkAuth, sharedStore } from "./store";
import Configure from "./tickets/Configure";
import Dashboard from "./tickets/Dashboard";

function tickets(container, props) {
  const App = view(props => {
    const { authenticatedUser, settings } = sharedStore;
    let Component = Configure;

    if (authenticatedUser && settings.subdomain) {
      Component = Dashboard;
    }

    return (
      <div>
        <h1>Zendesk</h1>

        {authenticatedUser && <div>Authenticated as {authenticatedUser.name}</div>}

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
