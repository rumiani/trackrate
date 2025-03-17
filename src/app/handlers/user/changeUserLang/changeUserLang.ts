import prisma from "@/lib/prisma";

export const changeUserLang = async (telegramId: string,languageCode:string) => {
  try {
    await prisma.user.update({
      where: { telegramId },
      data: { languageCode },
    });
    return true;
  } catch {
    return null;
  }
};
