/*
  Warnings:

  - A unique constraint covering the columns `[pollId,voterId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ipAddress` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pollId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "pollId" TEXT NOT NULL,
ADD COLUMN     "voterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollId_voterId_key" ON "Vote"("pollId", "voterId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
