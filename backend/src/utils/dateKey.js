import { DEFAULT_TIMEZONE } from "../config/constants.js";

// Returns "2026-10-29" for the given timezone. Used so tokens restart daily.
// We use the shop's timezone because the server runs in UTC.
export const getDateKey = (timeZone = DEFAULT_TIMEZONE, date = new Date()) =>
  date.toLocaleDateString("en-CA", { timeZone });