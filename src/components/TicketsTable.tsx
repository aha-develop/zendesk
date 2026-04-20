import React from "react";
import { view } from "@aha-app/react-easy-state";
import { useMemo } from "react";
import { loadViewData, sharedStore } from "../store";
import { columnFormatter, idToData } from "../tickets/columnFormatter";
import { Group } from "../tickets/Group";
import { Column, View, ViewData, ZendeskItem } from "../types";

const TicketsTable = ({ viewData, view }: { viewData: ViewData; view: View }) => {
  const items = viewData?.rows;

  const { settings, searchTerm } = sharedStore;
  const subdomain = settings.subdomain;
  const execution = view.execution;
  const group = execution.group;

  const columns: Column[] = useMemo(() => [...viewData.columns, { id: "__aha_feature", title: "Feature" }], [viewData]);

  const groupData: Record<string, ZendeskItem[]> = useMemo(() => {
    if (!group) return { "": items };

    return items.reduce<Record<string, ZendeskItem[]>>((acc, row) => {
      const groupName = String(row[group.id] || row[group.id + "_id"] || "");
      return {
        ...acc,
        [groupName]: [...(acc[groupName] || []), row],
      };
    }, {});
  }, [items, group]);

  const groups = useMemo(() => {
    if (!group) return [""];

    if (!group?.order) return Object.keys(groupData);

    const idTransformer = idToData(group.id, viewData);

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

  const groupFormatter = useMemo(() => columnFormatter(group, viewData, subdomain), [group, viewData, subdomain]);
  const formatters = useMemo(
    () => columns?.map(column => columnFormatter(column, viewData, subdomain)),
    [columns, viewData, subdomain],
  );

  if (!items?.length) {
    return searchTerm ? <p>No tickets match your search.</p> : <p>There are no tickets in this view.</p>;
  }

  return (
    <>
      <table className="record-table record-table--settings-page">
        <thead>
          <tr>
            {columns.map(col => (
              <th style={{ position: "sticky", top: "0px", zIndex: 10 }} key={col.id} scope="col">
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
        <tfoot>
          <tr>
            <th
              colSpan={columns.length}
              scope="row"
              style={{ textAlign: "right", backgroundColor: "var(--aha-color-background-secondary)" }}
            >
              <aha-button kind="icon" onClick={() => loadViewData(view.id, { force: true })}>
                <i className="fa-regular fa-refresh" />
              </aha-button>
            </th>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default view(TicketsTable);
