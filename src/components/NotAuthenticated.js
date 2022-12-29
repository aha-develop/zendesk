import React from "https://cdn.skypack.dev/react";
import { authenticateUser, sharedStore } from "../store";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";

const NotAuthenticated = ({ extensionId }) => {
  const { loadingAuth } = sharedStore;

  return (
    <div className="page-content empty-state">
      <div className="empty-state__content">
        <h3>Sign in with Zendesk</h3>
        <p>Authenticate with Zendesk to get started.</p>
        <aha-button disabled={loadingAuth || null} kind="primary" onClick={() => authenticateUser()}>
          {loadingAuth ? "Authenticating…" : "Authenticate with Zendesk"}
        </aha-button>
      </div>
    </div>
  );
};

export default view(NotAuthenticated);
