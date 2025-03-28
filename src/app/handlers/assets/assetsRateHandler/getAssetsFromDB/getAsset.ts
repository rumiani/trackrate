import { MyContext } from "@/app/bot";
import { allAssetsObjectsFromDB } from "./allAssetsFromDB/allAssetsFromDB";

export async function getAsset(ctx:MyContext,assetName: string) {
  const allAssetsObjects = await allAssetsObjectsFromDB(ctx);
  const assetObject = allAssetsObjects?.allAssets.find(
    (storedAsset) =>
      storedAsset?.enName
        .includes(assetName.toLowerCase()) ||
      storedAsset?.faName
        .includes(assetName.toLowerCase())
  );
  return assetObject;
}
