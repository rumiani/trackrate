import { MyContext } from "@/app/bot";
import { allAssetsObjectsFromDB } from "../allAssetsObjectsFromDB/allAssetsObjectsFromDB";

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
