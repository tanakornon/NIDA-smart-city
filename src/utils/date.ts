export function getYesterdayDate() {
  const unix = new Date().getTime() - 24 * 60 * 60 * 1000;
  const date = new Date(unix);
  date.setHours(0, 0, 0, 0);
  return date;
}
