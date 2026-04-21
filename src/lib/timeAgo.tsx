export function timeAgo(value: string | number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffInSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) return rtf.format(diffInSeconds, "seconds");
  if (absDiff < 3600) return rtf.format(Math.round(diffInSeconds / 60), "minutes");
  if (absDiff < 86400) return rtf.format(Math.round(diffInSeconds / 3600), "hours");
  if (absDiff < 86400 * 30) return rtf.format(Math.round(diffInSeconds / 86400), "days");
  if (absDiff < 86400 * 365) return rtf.format(Math.round(diffInSeconds / (86400 * 30)), "months");
  return rtf.format(Math.round(diffInSeconds / (86400 * 365)), "years");
}
