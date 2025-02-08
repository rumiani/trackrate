import { allAssetsObjectsFromDB } from "../allAssetsObjectsFromDB/allAssetsObjectsFromDB";

export default async function commandHandler(messageText: string) {
  const allAssets = await allAssetsObjectsFromDB();

  const commandReplies: { [key: string]: () => string } = {
    "/help": () =>
      `Available commands:\n/menu \n/assets\nDeveloper: @rumimaz`,
    "/assets": () => `Assets List:\n${allAssets?.assetsComandList}`,
  };
  if (commandReplies[messageText]) return commandReplies[messageText]();
  else return "Bad request, please check out the /menu";
}
