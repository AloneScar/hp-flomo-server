import { format } from "date-fns";

export function getTime() {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
};
