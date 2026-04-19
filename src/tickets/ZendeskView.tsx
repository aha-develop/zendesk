import React from "react";
import { view } from "@aha-app/react-easy-state";
import TicketsTable from "../components/TicketsTable";
import { View } from "../types";
import { SectionTitle } from "./SectionTitle";
import { useViewData } from "../lib/useViewData";

const ZendeskView = ({ view, onRemove }: { view: View; onRemove: () => void }) => {
  const { loading, viewData } = useViewData(view);

  return (
    <aha-panel>
      <div slot="heading">
        <SectionTitle title={view.title} onRemove={onRemove} />
      </div>
      {loading || !viewData ? (
        <aha-loading-row rows="3" column-widths="450px" />
      ) : (
        <TicketsTable viewData={viewData} view={view} />
      )}
    </aha-panel>
  );
};

export default view(ZendeskView);
