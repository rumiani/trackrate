import { MyContext } from "@/app/bot";
import { periodArray } from "@/data/keyboardObjects";

export function getStartDate(ctx:MyContext,period: string): Date {
    const rangeObj = periodArray(ctx).find((item) => item.date === period);    
    if (rangeObj!.range === null) return new Date(0);
    return new Date(Date.now() - rangeObj!.range);
}
