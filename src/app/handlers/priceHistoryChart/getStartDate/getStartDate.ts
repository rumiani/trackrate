import { dateRangeArray } from "@/data/keyboardObjects";

export function getStartDate(dateRange: string): Date {
    const rangeObj = dateRangeArray.find((item) => item.date === dateRange);
    if (rangeObj!.range === null) return new Date(0);
    return new Date(Date.now() - rangeObj!.range);
}
