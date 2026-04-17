import React from "react";
import { view } from "@aha-app/react-easy-state";
import { useEffect } from "react";
import TicketsTable from "../components/TicketsTable";
import { loadViewData } from "../store";
import { DashboardView, View, ViewData } from "../types";
import { SectionTitle } from "./SectionTitle";

const ZendeskView = ({
  dashboardView,
  data: { loading, data: viewData } = { loading: false, data: null },
  view,
  onRemove,
}: {
  dashboardView: DashboardView;
  data: { loading: boolean; data: ViewData | null } | null;
  view: View;
  onRemove: () => void;
}) => {
  const fetchData = !!viewData && !loading;

  useEffect(() => {
    if (!fetchData) {
      loadViewData(dashboardView.id);
    }
  }, [fetchData, dashboardView.id]);

  return (
    <aha-panel>
      <div slot="heading">
        <SectionTitle title={view.title} onRemove={onRemove} />
      </div>
      {loading || !viewData ? (
        <div className="subsection" style={{ fontSize: 28, textAlign: "center" }}>
          <aha-spinner />
        </div>
      ) : (
        <div className="subsection">
          <TicketsTable viewData={viewData} view={view} />
        </div>
      )}
    </aha-panel>
  );
};

export default view(ZendeskView);
