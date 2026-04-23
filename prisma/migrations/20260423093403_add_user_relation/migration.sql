-- DropIndex
DROP INDEX "public"."Prediction_createdAt_idx";

-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE INDEX "Prediction_userId_createdAt_idx" ON "Prediction"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
