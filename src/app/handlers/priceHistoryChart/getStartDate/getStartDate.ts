import { periodArray } from "@/data/keyboardObjects";

export function getStartDate(period: string): Date {
    const rangeObj = periodArray.find((item) => item.date === period);    
    if (rangeObj!.range === null) return new Date(0);
    return new Date(Date.now() - rangeObj!.range);
}
