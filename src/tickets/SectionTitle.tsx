import React from "react";

export const SectionTitle = ({ title, onRemove }: { title: string; onRemove: () => void }) => {
  return (
    <aha-split>
      <h2 style={{ margin: 0 }}>{title}</h2>

      <aha-menu>
        <aha-button slot="control" kind="secondary" size="small">
          <aha-icon icon="fa-solid fa-ellipsis"></aha-icon>
        </aha-button>
        <aha-menu-content>
          <aha-menu-item>
            <aha-button kind="plain" onClick={onRemove}>
              Remove
            </aha-button>
          </aha-menu-item>
        </aha-menu-content>
      </aha-menu>
    </aha-split>
  );
};
