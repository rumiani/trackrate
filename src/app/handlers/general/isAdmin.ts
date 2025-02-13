export const isAdmin = (userId: number) =>
  userId === +process.env.TELEGRAM_ADMIN_ID!;
