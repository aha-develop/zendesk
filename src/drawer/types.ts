export namespace Zendesk {
  export interface User {
    id: number;
    name: string;
    photo?: Attachment;
  }

  export interface CustomField {
    id: number;
    value: string;
  }

  export interface SatisfactionRating {
    comment: string;
    id: number;
    score: string;
  }

  export interface Via {
    channel: string;
  }

  export interface Comment {
    attachments: Attachment[];
    author_id: number;
    body: string;
    created_at: Date;
    id: number;
    metadata: Metadata;
    public: boolean;
    type: string;
  }

  export interface Attachment {
    content_type: string;
    content_url: string;
    file_name: string;
    id: number;
    size: number;
    thumbnails: Attachment[];
    height?: number;
    width?: number;
  }

  export interface Metadata {
    system: System;
    via: Via;
  }

  export interface System {
    client: string;
    ip_address: string;
    latitude: number;
    location: string;
    longitude: number;
  }

  export interface Ticket {
    assignee_id: number;
    collaborator_ids: number[];
    created_at: Date;
    custom_fields: Zendesk.CustomField[];
    description: string;
    due_at: null;
    external_id: string;
    follower_ids: number[];
    group_id: number;
    has_incidents: boolean;
    id: number;
    organization_id: number;
    priority: string;
    problem_id: number;
    raw_subject: string;
    recipient: string;
    requester_id: number;
    satisfaction_rating: Zendesk.SatisfactionRating;
    sharing_agreement_ids: number[];
    status: string;
    subject: string;
    submitter_id: number;
    tags: string[];
    type: string;
    updated_at: Date;
    url: string;
    via: Zendesk.Via;
  }
}

export type TicketProps = { ticket: Zendesk.Ticket };
