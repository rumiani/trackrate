import prisma from "@/lib/prisma";

export const lastNotifUpdate = async (telegramId: string) => {
  try {
    await prisma.user.update({
      where: { telegramId },
      data: { lastNotification: new Date() },
    });
    return true;
  } catch {
    return null;
  }
};
