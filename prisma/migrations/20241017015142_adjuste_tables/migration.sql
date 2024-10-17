/*
  Warnings:

  - You are about to drop the column `muscle` on the `predefined_exercises` table. All the data in the column will be lost.
  - You are about to drop the `exercises` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `muscleGroupId` to the `predefined_exercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_muscleGroupId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_predefinedExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_userId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_workoutId_fkey";

-- AlterTable
ALTER TABLE "predefined_exercises" DROP COLUMN "muscle",
ADD COLUMN     "muscleGroupId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "exercises";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "startWeight" DOUBLE PRECISION NOT NULL,
    "endWeight" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "workoutId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "predefinedExerciseId" INTEGER,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_predefinedExerciseId_fkey" FOREIGN KEY ("predefinedExerciseId") REFERENCES "predefined_exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predefined_exercises" ADD CONSTRAINT "predefined_exercises_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "muscle_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
