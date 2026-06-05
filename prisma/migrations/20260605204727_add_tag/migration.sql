/*
  Warnings:

  - You are about to drop the column `tags` on the `Meme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meme" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "MemeTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MemeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemeToMemeTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MemeToMemeTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "MemeTag_userId_idx" ON "MemeTag"("userId");

-- CreateIndex
CREATE INDEX "_MemeToMemeTag_B_index" ON "_MemeToMemeTag"("B");

-- AddForeignKey
ALTER TABLE "MemeTag" ADD CONSTRAINT "MemeTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemeToMemeTag" ADD CONSTRAINT "_MemeToMemeTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Meme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemeToMemeTag" ADD CONSTRAINT "_MemeToMemeTag_B_fkey" FOREIGN KEY ("B") REFERENCES "MemeTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
