import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { authenticateUser, sharedStore } from "./store";

const Configure = () => {
  const { authenticatedUser, loadingAuth, settings } = sharedStore;

  return (
    <div>
      <div>
        Zendesk domain: <input type="text" value={settings.subdomain} disabled />
        <a href={`/settings/account/extensions`} target="_blank" rel="noreferrer">
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
};

export default view(Configure);
