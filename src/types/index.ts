import * as z from "zod";

export const TicketsCodec = z.looseObject({
  rows: z.array(
    z.object({
      ticket: z.object({
        id: z.number(),
        status: z.string(),
        description: z.string().nullable(),
      }),
      subject: z.string(),
      assignee_id: z.number().nullable(),
    }),
  ),
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
