import * as z from "zod";
import { Settings } from "../extension";

export const UserCodec = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string().nullish(),
});

export type User = z.infer<typeof UserCodec>;

// --- Views API ---

const OrderCodec = z.enum(["asc", "desc"]);

const AllCodec = z.looseObject({
  field: z.string(),
  operator: z.string(),
  value: z.string().nullish(),
});

const ConditionsCodec = z.looseObject({
  all: z.array(AllCodec),
  any: z.array(z.any()),
});

const ColumnCodec = z.looseObject({
  id: z.union([z.number(), z.string()]),
  title: z.string(),
});

export type Column = z.infer<typeof ColumnCodec>;

const GroupCodec = z.looseObject({
  id: z.union([z.number(), z.string()]),
  title: z.string().optional(),
  order: OrderCodec.optional(),
});

export type Group = z.infer<typeof GroupCodec>;

const RestrictionCodec = z.looseObject({
  type: z.string(),
  id: z.number(),
});

const ViewExecutionCodec = z.looseObject({
  group_by: z.string().nullish(),
  sort_by: z.string().nullish(),
  group_order: OrderCodec.nullish(),
  sort_order: OrderCodec,
  group: GroupCodec.nullish(),
  sort: GroupCodec.nullish(),
});

export type ViewExecution = z.infer<typeof ViewExecutionCodec>;

export const DashboardViewCodec = z.object({
  id: z.number(),
  title: z.string(),
});

export type DashboardView = z.infer<typeof DashboardViewCodec>;

export const ViewCodec = z.looseObject({
  id: z.number(),
  title: z.string(),
  active: z.boolean().nullish(),
  updated_at: z.coerce.date().nullish(),
  created_at: z.coerce.date().nullish(),
  position: z.number().nullish(),
  description: z.string().nullish(),
  execution: ViewExecutionCodec.nullish(),
  conditions: ConditionsCodec.nullish(),
  restriction: RestrictionCodec.nullish(),
});

export const ViewResponseCodec = z.looseObject({
  count: z.number(),
  next_page: z.string().nullish(),
  previous_page: z.string().nullish(),
  views: z.array(ViewCodec),
});

export type View = z.infer<typeof ViewCodec>;

// --- View Execution Results ---

const LastCommentCodec = z.looseObject({
  id: z.number(),
  body: z.string(),
  created_at: z.coerce.date(),
  author_id: z.number(),
  public: z.boolean(),
});

const ZendeskTicketCodec = z.looseObject({
  id: z.number(),
  status: z.string(),
  description: z.string().nullish(),
  type: z.string().nullish(),
  priority: z.string().nullish(),
  url: z.string(),
  last_comment: LastCommentCodec.nullish(),
});

const ZendeskItemCodec = z.looseObject({
  ticket: ZendeskTicketCodec,
  subject: z.string(),
  assignee_id: z.number().nullish(),
  requester_id: z.number().nullish(),
  group: z.string().nullish(),
  locale: z.string().nullish(),
  custom_status_id: z.number().nullish(),
});

export type ZendeskItem = z.infer<typeof ZendeskItemCodec>;

// Result of calling the execute view endpoint
// https://developer.zendesk.com/api-reference/ticketing/business-rules/views/#execute-view
export const ViewDataCodec = z.looseObject({
  columns: z.array(ColumnCodec),
  groups: z.array(GroupCodec).optional(),
  rows: z.array(ZendeskItemCodec),
  view: z.object({ id: z.number() }),
  // Not in the docs but in the data
  users: z.array(UserCodec).nullish(),
  next_page: z.string().nullish(),
});

export type ViewData = z.infer<typeof ViewDataCodec>;

export const TicketsCodec = z.looseObject({
  rows: z.array(ZendeskItemCodec),
  users: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

export const ZendeskRecordCodec = z.looseObject({
  uniqueId: z.string(),
  identifier: z.string(),
  name: z.string(),
  url: z.string(),
  status: z.string(),
  assigneeName: z.string(),
  description: z.string(),
});

export type ZendeskRecord = z.infer<typeof ZendeskRecordCodec>;

const FeatureReferenceCodec = z.looseObject({
  referenceNum: z.string(),
  name: z.string(),
});

export type FeatureReference = z.infer<typeof FeatureReferenceCodec>;

const ExtensionFieldCodec = z.object({
  value: z.union([z.string(), z.number()]),
  extensionFieldable: FeatureReferenceCodec,
});

export type ExtensionField = z.infer<typeof ExtensionFieldCodec>;

export const ExtensionFieldsResponseCodec = z.object({
  extensionFields: z.object({
    nodes: z.array(ExtensionFieldCodec),
  }),
});

export type Store = {
  configured: boolean;
  loaded: boolean;
  settings: Settings;
  loadingAuth: boolean;
  authenticatedUser: User | null;
  importedItems: {
    loading: boolean;
    // zendesk ticket ID to feature reference
    value: Record<string, FeatureReference> | null;
  };
  views: {
    loading: boolean;
    value: View[] | null;
  };
  dashboardViews: {
    loading: boolean;
    value: DashboardView[] | null;
  };
  importing: Record<string, boolean>;
  viewData: Record<number, { loading: boolean; data: ViewData | null }>;
  users: Record<number, User>;
  refreshing: boolean;
  searchTerm?: string;
  _tempObservable: unknown;
};
