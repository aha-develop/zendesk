import React from "react";
import { ZendeskRecord } from "../types";
import { sanitizeUrl } from "../lib/sanitizeUrl";
import { titleCase } from "../lib/titleCase";

const Card = ({ record }: { record: ZendeskRecord }) => {
  return (
    <aha-card highlight-color="var(--aha-color-background-green)">
      <aha-card-row>
        <aha-card-group>
          <aha-card-field>
            <aha-icon slot="icon" icon="fa-solid fa-grid-2 fa-fw" />
          </aha-card-field>
          <aha-card-field nowrap class="title-field">
            <a href={sanitizeUrl(record.url)} target="_blank" rel="noopener noreferrer">
              {record.identifier}
            </a>
          </aha-card-field>
        </aha-card-group>
      </aha-card-row>
      <aha-card-divider />
      <aha-card-row>
        <aha-card-group>
          <aha-card-field>
            <a href={sanitizeUrl(record.url)} target="_blank" rel="noopener noreferrer">
              <strong>{record.name}</strong>
            </a>
          </aha-card-field>
        </aha-card-group>
      </aha-card-row>
      <aha-card-row>
        <aha-card-group>
          <aha-card-field nowrap>{record.assigneeName}</aha-card-field>
        </aha-card-group>
        <aha-card-group>
          <aha-pill color="var(--aha-color-background-green)" text-color="var(--aha-color-text)" size="small">
            {titleCase(record.status)}
          </aha-pill>
        </aha-card-group>
      </aha-card-row>
    </aha-card>
  );
};

export default Card;
