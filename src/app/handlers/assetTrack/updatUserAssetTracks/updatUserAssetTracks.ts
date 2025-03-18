import prisma from "@/lib/prisma";
import { DirectionType, TrackingType } from "@prisma/client";
import userStoredData from "../../user/userStoredData/userStoredData";
import { allAssetsObjectsFromDB } from "../../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { startCase } from "lodash";
import { MyContext } from "@/app/bot";

export async function updatUserAssetTracks(data: {
  code: string;
  percentage: string;
  ctx: MyContext;
}) {
  try {
    const { code, percentage, ctx } = data;
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
      const lang = ctx.session.__language_code;
      const track =
        lang === "en"
          ? foundAssetTrack.asset.enName[0]
          : foundAssetTrack.asset.faName[0];
      return `${startCase(track)} ${ctx.t("assetUpdated")}`;
    }
    const allAssets = await allAssetsObjectsFromDB(ctx);
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
    return `${startCase(
      asset!.enName[0]
    )} has been saved for ${+percentage}% change and you will get a message when the change happens.\n/myassets\n/menu`;
  } catch {
    return "Something went wrong. /menu";
  }
}
