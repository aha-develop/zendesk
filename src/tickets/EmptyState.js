import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import AddView from "./AddView";

const EmptyState = () => (
  <div className="sections" style={{ alignItems: "center" }}>
    <section className="empty-state__content">
      <div style={{ fontSize: 32, color: "#B5B5B5" }}>
        <aha-icon icon="fa-regular fa-table" />
      </div>
      <h3>Get started by adding Zendesk views</h3>
      <p>You can add multiple views to this page to maximize your work.</p>
      <AddView />
    </section>
  </div>
);
export default view(EmptyState);
