-- PDR §5: no social layer. Endorsements and comments are gone; milestones are owner-authored and attach to a job.
DROP TABLE IF EXISTS "Endorsement";
DROP TABLE IF EXISTS "Comment";
ALTER TABLE "CareerActivity" DROP COLUMN IF EXISTS "experienceCompany";
ALTER TABLE "CareerActivity" ADD COLUMN "experienceId" TEXT;
ALTER TABLE "CareerActivity" ADD CONSTRAINT "CareerActivity_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "CareerActivity_experienceId_idx" ON "CareerActivity"("experienceId");
