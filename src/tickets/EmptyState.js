import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import AddView from "./AddView";

const EmptyState = () => (
  <div className="page-content empty-state">
    <div className="empty-state__content">
      <h3>Get started by adding Zendesk views</h3>
      <p>You can add multiple views to this page to maximize your work.</p>
      <AddView />
    </div>
  </div>
);
export default view(EmptyState);
