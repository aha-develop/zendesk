import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";

const NotConfigured = ({ identifier }) => {
  return (
    <div className="page-content empty-state">
      <div className="empty-state__content">
        <h3>Add Zendesk subdomain</h3>
        <p>Please update your extension settings to provide a Zendesk subdomain.</p>
        <aha-button href={`/settings/account/extensions/${identifier}`} kind="primary" target="_blank">
          Configure Extension
        </aha-button>
      </div>
    </div>
  );
};

export default view(NotConfigured);
