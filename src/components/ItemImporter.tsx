import React from "react";
import { view } from "@aha-app/react-easy-state";
import { importItem, sharedStore } from "../store";

const AhaDrawer = window.require("javascripts/drawer");

const ItemImporter = ({ item }) => {
  const { importedItems, importing } = sharedStore;

  if (importedItems.loading) {
    return null;
  }

  const id = String(item.ticket.id);
  const importedItem = importedItems.value[id];
  if (importedItem) {
    const referenceNum = importedItem.referenceNum;
    const type = String(importedItem.__typename ?? "Feature");
    return (
      <a
        href={`/${type.toLowerCase()}s/${referenceNum}`}
        data-drawer-url={`/${type.toLowerCase()}s/${referenceNum}`}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          AhaDrawer.instance().showUrl(`/${type.toLowerCase()}s/${referenceNum}`);
        }}
      >
        <aha-record-reference record-type={type} record-id={referenceNum}>
          {referenceNum}
        </aha-record-reference>
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
