import { allAssetsObjectsFromDB } from "../allAssetsObjectsFromDB/allAssetsObjectsFromDB";

export async function getAsset(assetName: string) {
  const allAssetsObjects = await allAssetsObjectsFromDB();
  const assetObject = allAssetsObjects?.allAssets.find(
    (storedAsset) =>
      storedAsset?.enName
        .includes(assetName.toLowerCase()) ||
      storedAsset?.faName
        .includes(assetName.toLowerCase())
  );
  return assetObject;
}
