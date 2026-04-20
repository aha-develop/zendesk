import React from "react";
import { setSearchTerm, sharedStore } from "../store";

export function Search() {
  const { searchTerm } = sharedStore;
  return (
    <aha-search-field
      placeholder="Search tickets"
      value={searchTerm}
      onAhaSearchFieldSearch={e => setSearchTerm(e.detail.value)}
      onInput={e => setSearchTerm(e.target.value)}
    />
  );
}
