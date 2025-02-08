import prisma from "@/lib/prisma";
import { telegramUserTypes } from "@/types/user";
// import { telegramUserTypes } from "@/types/user";

export async function addUser(newUser: telegramUserTypes) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        telegramId: newUser.id.toString(),
      },
    });

    if (existingUser) return { user: existingUser, isNewUser: false };

    const createdUser = await prisma.user.create({
      data: {
        name: newUser.first_name || "",
        telegramId: newUser.id.toString(),
        isBot: newUser.is_bot || false, // Default to false if not provided
        username: newUser.username || "",
        languageCode: newUser.language_code || "",
        status: "ACTIVE",
        notificationPref: "HOURLY",
      },
    });

    return { user: createdUser, isNewUser: true };
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
  }
}
