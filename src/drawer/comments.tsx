import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { zendeskFetch } from "../zendesk";
import { FormattedDateTime } from "./FormattedDateTime";
import { TicketProps, Zendesk } from "./types";

const Avatar: React.FC<{ user: Zendesk.User }> = ({ user }) => {
  const best = user.photo?.thumbnails?.find(t => t.width >= 24) || user.photo;
  if (best) {
    return (
      <a className="avatar-framed size24">
        <img src={best.content_url} />
      </a>
    );
  }

  return null;
};

const Comment: React.FC<{ comment: Zendesk.Comment; author?: Zendesk.User; authorLoading: boolean }> = ({
  comment,
  author,
  authorLoading,
}) => {
  return (
    <li
      className={`zendesk__comment comment comments__comment ${
        comment.public ? "comment__public" : "comment__private"
      }`}
    >
      {authorLoading ? <aha-spinner></aha-spinner> : <Avatar user={author} />}
      <header className="comments__header">
        <div className="name comments__author">
          {authorLoading ? <aha-spinner></aha-spinner> : <span>{author.name}</span>}
        </div>
        <div className="controls comments__controls">
          <span className="posted">
            <FormattedDateTime date={comment.created_at} />
          </span>
        </div>
      </header>
      <div className="body comments__body">
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
    </li>
  );
};

export const Comments: React.FC<TicketProps> = ({ ticket }) => {
  const [comments, setComments] = useState<Zendesk.Comment[] | null>(null);
  const [authors, setAuthors] = useState<{ [name: string]: Zendesk.User } | null>(null);

  const loadComments = useCallback(async ticketId => {
    const response = await zendeskFetch(`/tickets/${ticketId}/comments`);
    const comments = response["comments"] as Zendesk.Comment[];
    setComments(comments.reverse());

    const authorIds = comments.map(comment => comment.author_id).filter(Boolean);
    loadAuthors(authorIds);
  }, []);

  const loadAuthors = useCallback(async (authorIds: number[]) => {
    const response = await zendeskFetch(`/users/show_many?ids=${authorIds.join(",")}`);
    const users = response["users"] as Zendesk.User[];

    setAuthors(
      users.reduce((acc, user) => {
        acc[String(user.id)] = user;
        return acc;
      }, {}),
    );
  }, []);

  useEffect(() => {
    setComments(null);
    setAuthors(null);
    loadComments(ticket.id);
  }, [ticket.id]);

  if (!comments) return <aha-spinner />;

  return (
    <div className="zendesk__comments comments comments__container">
      <ul className="list comments__list comments--not-empty">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            author={authors && authors[String(comment.author_id)]}
            authorLoading={authors === null}
          />
        ))}
      </ul>
    </div>
  );
};
