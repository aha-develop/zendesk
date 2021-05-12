import React from "react";

const timeOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour12: true,
  timeZoneName: "short",
};
const dateOptions = timeOptions;

export const FormattedDateTime: React.FC<{ date: Date | string }> = ({ date }) => {
  const actualDate = date instanceof Date ? date : new Date(date);

  return <span className="datetime">{actualDate.toLocaleTimeString(undefined, timeOptions)}</span>;
};
