import { useEffect } from "react";
import { loadViewData, sharedStore } from "../store";
import { View, ViewData } from "../types";

export function useViewData(view: View): { loading: boolean; viewData: ViewData | null } {
  const { loading, data: viewData } = sharedStore.viewData?.[view.id] ?? { loading: false, data: null };
  const fetchData = !!viewData && !loading;

  useEffect(() => {
    if (!fetchData) {
      loadViewData(view.id);
    }
  }, [fetchData, view.id]);

  return { loading, viewData };
}
