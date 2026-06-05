/*
  Warnings:

  - Added the required column `userId` to the `Meme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meme" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Meme_userId_idx" ON "Meme"("userId");

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
