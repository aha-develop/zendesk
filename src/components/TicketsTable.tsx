import React from "react";
import { view } from "@aha-app/react-easy-state";
import { useMemo } from "react";
import { sharedStore } from "../store";
import { columnFormatter, idToData } from "../tickets/columnFormatter";
import { Group } from "../tickets/Group";
import { Column, View, ViewData, ZendeskItem } from "../types";

const TicketsTable = ({ viewData, view }: { viewData?: ViewData; view: View }) => {
  const items = viewData?.rows;

  if (!items?.length) {
    return <p>There are no tickets in this view.</p>;
  }

  const { settings } = sharedStore;
  const subdomain = settings.subdomain;

  const columns: Column[] = useMemo(() => [...viewData.columns, { id: "__aha_feature", title: "Feature" }], [viewData]);

  const execution = view.execution;
  const group = execution.group;
  const groupData: Record<string, ZendeskItem[]> = useMemo(() => {
    if (!group) return { "": items };

    if (execution.sort_by) {
      items.sort((a, b) => {
        const aValue = a[execution.sort_by];
        const bValue = b[execution.sort_by];
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });

      if (execution.sort_order === "desc") {
        items.reverse();
      }
    }

    return items.reduce<Record<string, ZendeskItem[]>>((acc, row) => {
      const groupName = String(row[group.id] || row[group.id + "_id"] || "");
      return {
        ...acc,
        [groupName]: [...(acc[groupName] || []), row],
      };
    }, {});
  }, [items, execution.sort_by, execution.sort_order, group]);

  const groups = useMemo(() => {
    if (!group) return [""];

    if (!group?.order) return Object.keys(groupData);

    const idTransformer = idToData(group.id, viewData);

    if (!group?.order) return Object.keys(groupData);

    const groupIds = Object.entries(groupData)
      .map(([id, rows]) => ({
        id,
        name: idTransformer(rows[0]),
      }))
      .sort((a, b) => {
        return String(a.name).localeCompare(String(b.name));
      })
      .map(group => group.id);

    if (group.order === "desc") {
      return groupIds.reverse();
    }

    return groupIds;
  }, [group, groupData, viewData]);

  const groupFormatter = columnFormatter(group, viewData, subdomain);
  const formatters = columns?.map(column => columnFormatter(column, viewData, subdomain));

  return (
    <table className="record-table record-table--settings-page">
      <thead>
        <tr>
          {columns.map(col => (
            <th style={{ position: "sticky", top: "0px" }} key={col.id}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groups.map(groupName => (
          <Group
            key={groupName}
            items={groupData[groupName]}
            groupName={groupName}
            Formatter={groupFormatter}
            formatters={formatters}
          />
        ))}
      </tbody>
    </table>
  );
};

export default view(TicketsTable);
