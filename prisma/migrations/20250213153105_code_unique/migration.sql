/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");
