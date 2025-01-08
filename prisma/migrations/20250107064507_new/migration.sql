/*
  Warnings:

  - Added the required column `cinema_id` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN     "cinema_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Cinema" (
    "cinema_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "openHour" TIMESTAMP(3) NOT NULL,
    "closeHour" TIMESTAMP(3) NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "numberOfHalls" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("cinema_id")
);

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("cinema_id") ON DELETE RESTRICT ON UPDATE CASCADE;
