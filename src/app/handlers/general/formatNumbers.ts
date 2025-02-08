import _ from "lodash";

export function formatNumHandler(number: number | string) {
  const str = number.toString();
  return _.replace(str, /\B(?=(\d{3})+(?!\d))/g, ",");
}
