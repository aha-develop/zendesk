import React, { HTMLProps, useCallback, useEffect, useState } from "react";
import { zendeskFetch } from "../zendesk";
import { Comments } from "./comments";
import { Zendesk, TicketProps } from "./types";
import Style from "../styles";
import { FormattedDateTime } from "./FormattedDateTime";

const TicketLink: React.FC<TicketProps & HTMLProps<any>> = props => {
  const { ticket } = props;
  const url = ticket.url.replace("/api/v2", "/agent").replace(".json", "");

  return (
    <a {...props} href={url} rel="noreferrer noopener" target="_blank">
      {props.children || ticket.subject}
    </a>
  );
};

const Title: React.FC<TicketProps> = ({ ticket }) => {
  return (
    <div className="drawer-nav__row details__name--row feature__name" id="drawer-nav__row--header">
      <div className="drawer-nav__cell  drawer-nav__cell--expand">
        <div className="details__name">{ticket.subject}</div>
      </div>
    </div>
  );
};

const Nav: React.FC<TicketProps> = ({ ticket }) => {
  const onClickClose = event => {
    event.preventDefault();
    window["require"]("javascripts/drawer").hide();
  };

  return (
    <div className="drawer-nav__row">
      <div className="drawer-nav__cell">
        <TicketLink
          ticket={ticket}
          className="record-reference-pill copy-button"
          data-clipboard-action="copy"
          data-clipboard-text={ticket.url}
        >
          <span className="record-reference-pill__prefix">Ticket</span>
          <span className="record-reference-pill__identifier">{ticket.id}</span>
          <span className="record-reference-pill__copied">Copied!</span>
        </TicketLink>
      </div>
      <div className="drawer-nav__cell">
        <TicketLink ticket={ticket} className="btn btn-mini">
          Details <i className="fa-solid fa-angle-right"></i>
        </TicketLink>

        <button className="drawer-close-button btn btn-mini" onClick={onClickClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

const Drawer = ({ ticketId, subdomain }) => {
  const [ticket, setTicket] = useState<Zendesk.Ticket | null>(null);
  const [submitter, setSubmitter] = useState<Zendesk.User | null>(null);

  const fetchSubmitter = useCallback(async submitterId => {
    const response = await zendeskFetch(`/users/${submitterId}`);
    setSubmitter(response["user"] as Zendesk.User);
  }, []);

  const fetchTicket = useCallback(async ticketId => {
    const response = await zendeskFetch(`/tickets/${ticketId}`);
    const ticket = response["ticket"] as Zendesk.Ticket;
    setTicket(ticket);
    fetchSubmitter(ticket.submitter_id);
  }, []);

  useEffect(() => {
    setTicket(null);
    fetchTicket(ticketId);
  }, [ticketId]);

  if (!ticket) {
    return <aha-spinner />;
  }

  return (
    <div className="content zendesk__ticket" id="tabbed-record-contents">
      <div className="details tabbed-drawer tabbed-record">
        <div className="drawer-nav">
          <Nav ticket={ticket} />
          <Title ticket={ticket} />
        </div>
        <div className="drawer-contents tabbed-record__scroll-container">
          <div className="zendesk__ticket__details details__created-by">
            <FormattedDateTime date={ticket.created_at} /> | {submitter ? submitter.name : <aha-spinner></aha-spinner>}
          </div>
          <Comments ticket={ticket} />
        </div>
      </div>
    </div>
  );
};

aha.on("ticket", ({ drawerProps: { ticket_id } }, { settings }) => {
  return (
    <>
      <Style />
      <Drawer ticketId={ticket_id} subdomain={settings.get("subdomain")} />
    </>
  );
});
