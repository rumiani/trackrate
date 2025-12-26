import prisma from "@/lib/prisma";
import userStoredData from "../../user/userStoredData/userStoredData";
import { startCase } from "lodash";
import { MyContext } from "@/app/bot";

export default async function removeAssetTrack(ctx: MyContext, code: string) {
  try {
    const userData = await userStoredData(ctx.from!.id.toString());

    if (userData) {
      const assetTrack = userData?.UserAssetTrack.find(
        (assetTrack) => assetTrack?.asset.code === code
      );
      await prisma.userAssetTrack.delete({
        where: { id: assetTrack?.id },
      });
      const enLang = ctx.session.__language_code === "en";
      return `${startCase(enLang ? assetTrack?.asset.enName[0] : assetTrack?.asset.faName[0])} ${ctx.t("assetRemovedCaption")}`;
    }
    return ctx.t("assetNotFound");
  } catch {
    return "An error occurred while removing the currency. /menu";
  }
}
