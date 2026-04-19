import { useDeferredValue, useEffect, useMemo } from "react";
import { loadViewData, sharedStore } from "../store";
import { View, ViewData, ZendeskItem } from "../types";

export function useViewData(view: View): { loading: boolean; viewData: ViewData | null } {
  const { loading, data: viewData } = sharedStore.viewData?.[view.id] ?? { loading: false, data: null };
  const fetchData = !!viewData && !loading;
  const searchTerm = useDeferredValue(sharedStore.searchTerm);

  useEffect(() => {
    if (!fetchData) {
      loadViewData(view.id);
    }
  }, [fetchData, view.id]);

  const filteredViewData: ViewData | null = useMemo(() => {
    if (!viewData?.rows) return viewData;

    if (!searchTerm) return viewData;

    const searchValue = searchTerm.toLowerCase();

    const rows = viewData.rows.filter((row: ZendeskItem) => {
      return viewData.columns.some(column => {
        const cellValue = String(row[column.id] ?? "").toLowerCase();
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
