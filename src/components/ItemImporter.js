import React from "https://cdn.skypack.dev/react";
import { view } from "https://cdn.skypack.dev/@aha-app/react-easy-state";
import { importItem, sharedStore } from "../store";

const AhaDrawer = window.require("javascripts/drawer");

const ItemImporter = ({ item }) => {
  const { importedItems, importing } = sharedStore;

  if (importedItems.loading) {
    return null;
  }

  const { id } = item.ticket;
  const importedItem = importedItems.value[id];
  if (importedItem) {
    const { type = "Feature", referenceNum } = importedItem;
    return (
      <a
        href={`/${type.toLowerCase()}s/${referenceNum}`}
        data-drawer-url={`/${type.toLowerCase()}s/${referenceNum}`}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();

          AhaDrawer.instance().showUrl(event.target.dataset.drawerUrl);
        }}
      >
        {referenceNum}
      </a>
    );
  } else if (importing[id]) {
    return (
      <aha-button disabled size="small">
        <aha-spinner />
        &nbsp;&nbsp;Importing…
      </aha-button>
    );
  } else {
    return (
      <aha-button size="small" onClick={() => importItem(item)}>
        Promote to feature
      </aha-button>
    );
  }
};

export default view(ItemImporter);
