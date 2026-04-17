import React from "react";

export const SectionTitle = ({ title, onRemove }: { title: string; onRemove: () => void }) => {
  return (
    <div className="section__title">
      <aha-flex align-items="center" justify-content="space-between">
        <h2>{title}</h2>

        <aha-menu>
          <aha-button slot="control" kind="secondary" size="small">
            <aha-icon icon="fa-solid fa-ellipsis"></aha-icon>
          </aha-button>
          <aha-menu-content>
            <aha-menu-item>
              <aha-button kind="text" onClick={onRemove}>
                Remove
              </aha-button>
            </aha-menu-item>
          </aha-menu-content>
        </aha-menu>
      </aha-flex>
    </div>
  );
};
