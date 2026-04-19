import { useDeferredValue, useEffect, useMemo } from "react";
import { loadViewData, sharedStore } from "../store";
import { View, ViewData, ZendeskItem } from "../types";
import { idToData } from "../tickets/columnFormatter";

/**
 * Load data ( tickets ) for a given view definition.
 * Also applies client side filtering based on the search term.
 */
export function useViewData(view: View): { loading: boolean; viewData: ViewData | null } {
  const { loading, data: viewData } = sharedStore.viewData?.[view.id] ?? { loading: false, data: null };
  const fetchData = !!viewData && !loading;
  const searchTerm = useDeferredValue(sharedStore.searchTerm);

  // Load data for the view if we don't have it already
  useEffect(() => {
    if (!fetchData) {
      loadViewData(view.id);
    }
  }, [fetchData, view.id]);

  // Apply client side filtering based on the search term
  const filteredViewData: ViewData | null = useMemo(() => {
    if (!viewData?.rows) return viewData;

    if (!searchTerm) return viewData;

    const searchValue = searchTerm.toLowerCase();
    const columnsRender = Object.fromEntries(
      // Search the formatted column values, itToData is used to render the cells
      viewData.columns.map(column => [column.id, idToData(column.id, viewData)] as const),
    );

    const rows = viewData.rows.filter((row: ZendeskItem) => {
      return viewData.columns.some(column => {
        const cellValue = String(columnsRender[column.id](row) ?? "").toLowerCase();
        return cellValue.includes(searchValue);
      });
    });

    return {
      ...viewData,
      rows: rows ?? [],
    };
  }, [searchTerm, viewData]);

  return { loading, viewData: filteredViewData };
}
