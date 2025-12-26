import prisma from "@/lib/prisma";
import { DirectionType, TrackingType } from "@prisma/client";
import userStoredData from "../../user/userStoredData/userStoredData";
import { startCase } from "lodash";
import { MyContext } from "@/app/bot";
import { allAssetsFromDB } from "../../assets/assetsRateHandler/getAssetsFromDB/allAssetsFromDB/allAssetsFromDB";

export async function updatUserAssetTracks(data: {
  code: string;
  percentage: string;
  ctx: MyContext;
}) {
  try {
    const { code, percentage, ctx } = data;
    const enLang = ctx.session.__language_code === "en";
    const userData = await userStoredData(ctx.from!.id.toString());
    if (!userData) return;
    const foundAssetTrack = userData.UserAssetTrack.find(
      (assetTrack) => assetTrack.asset.code.toLowerCase() === code.toLowerCase()
    );

    if (foundAssetTrack) {
      await prisma.userAssetTrack.update({
        where: { id: foundAssetTrack.id },
        data: {
          threshold: +percentage,
          userId: userData.id,
          assetId: foundAssetTrack.asset.id,
          trackingType: TrackingType.PERCENTAGE_CHANGE,
          direction: DirectionType.INCREASE,
        },
      });
      const track = enLang
        ? foundAssetTrack.asset.enName[0]
        : foundAssetTrack.asset.faName[0];
      return `${startCase(track)} ${ctx.t("assetUpdated")}`;
    }
    const allAssets = await allAssetsFromDB(ctx);
    const asset = allAssets?.allAssets.find(
      (asset) => asset.code.toLowerCase() === code.toLowerCase()
    );
    await prisma.userAssetTrack.create({
      data: {
        threshold: +percentage,
        userId: userData.id,
        assetId: asset!.id,
        trackingType: TrackingType.PERCENTAGE_CHANGE,
        direction: DirectionType.INCREASE,
      },
    });
    const assetName = enLang ? asset!.enName[0] : asset!.faName[0];
    return `${ctx.t('asset')}: ${startCase(assetName)}\n${ctx.t('percentage')}: ${+percentage}%\n ${ctx.t("assetSaved")}`;
  } catch {
    return "Something went wrong. /menu";
  }
}
