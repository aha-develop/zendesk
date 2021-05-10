import { AuthProvider, useAuth } from "@aha-app/aha-develop-react";
import React from "react";
import { TICKET_FIELD } from "./extension";
import Styles from "./styles";

const Attribute = ({ record, fields, subdomain }) => {
  const { error, authed } = useAuth(async () => {});
  const ticketId = fields[TICKET_FIELD];

  if (!ticketId) {
    return (
      <>
        <aha-flex align-items="center" justify-content="space-between" gap="5px">
          <div>Not linked</div>
        </aha-flex>
      </>
    );
  }

  const ticketUrl = `https://${subdomain}/agent/tickets/${ticketId}`;

  return (
    <aha-flex align-items="center" justify-content="space-between" gap="5px">

    </aha-flex>
  )
};

aha.on("attribute", ({ record, fields }, { settings }) => {
  return (
    <>
      <Styles />
      <AuthProvider serviceName="zendesk">
        <Attribute fields={fields} record={record} subdomain={settings.subdomain} />
      </AuthProvider>
    </>
  );
});
