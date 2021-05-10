import { linkTicketToRecord } from "../store";
import { zendeskFetch } from "../zendesk";

const validTicketUrl = urlString => {
  const url = new URL(urlString);
  return url.protocol === "https:" && url.host.endsWith("zendesk.com") && url.pathname.match(/tickets\/\d+/);
};

aha.on(
  "addLink",
  /**
   * @param {object} props
   * @param {Aha.Feature=} props.record
   * @param {string} props.ticketUrl
   */
  async ({ record, ticketUrl }) => {
    if (!ticketUrl) {
      ticketUrl = await aha.commandPrompt("Ticket URL", {
        placeholder: "Enter the URL to a ticket",
      });
    }

    if (!validTicketUrl(ticketUrl)) {
      throw new Error("Please enter a valid ticket URL");
    }

    const ticketId = new URL(ticketUrl).pathname.split("/").slice(-1)[0];
    const response = await zendeskFetch(`/tickets/${ticketId}`);
    if (!response || !response["ticket"]) throw new Error("Ticket not found");
    const { ticket } = response;

    if (!record) {
      const referenceNum = await aha.commandPrompt("Aha! reference", {
        placeholder: "Enter the feature reference num",
      });

      if (!referenceNum) throw new Error("No reference number");

      record = await aha.models.Feature.select("id", "referenceNum").find(referenceNum);
    }

    if (!record || !record.persisted) throw new Error("Record not found");

    await linkTicketToRecord(ticket.id, record);
  },
);
