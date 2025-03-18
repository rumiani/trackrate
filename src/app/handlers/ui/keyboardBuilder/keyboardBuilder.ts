import { MyContext } from "@/app/bot";
import { CategoryKeyboardDataTypes } from "@/data/keyboardObjects";
import { InlineKeyboard } from "grammy";

export const keyboardBuilder = (
  ctx:MyContext,
  list: CategoryKeyboardDataTypes[],
  n: number
) => {
  const keyboard = new InlineKeyboard();
  list.forEach((item, index) => {
    if (index % n === 0 && index !== 0) keyboard.row();
    keyboard.text(item.name, item.query);
  });
  keyboard.row().text(ctx.t("cancel"), "cancel");
  return keyboard;
};
