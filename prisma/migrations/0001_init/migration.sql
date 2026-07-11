-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "resumeUrl" TEXT,
    "selectedTemplate" TEXT NOT NULL DEFAULT 'minimal',
    "rawText" TEXT,
    "profileData" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "responsibilities" TEXT[],
    "companyInfo" JSONB,
    "dayInLife" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceMetric" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ExperienceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "experienceId" TEXT,
    "issuerName" TEXT NOT NULL,
    "issuerEmail" TEXT NOT NULL,
    "issuerUserId" TEXT,
    "relationship" TEXT NOT NULL,
    "sharedCompany" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verificationLevel" INTEGER NOT NULL DEFAULT 1,
    "vcJwt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "message" TEXT,
    "experienceCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "experienceCompany" TEXT,
    "body" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "caption" TEXT,
    "experienceCompany" TEXT,
    "year" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "experienceCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TailoredResume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobUrl" TEXT,
    "profileData" JSONB NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TailoredResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "profileVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE INDEX "User_slug_idx" ON "User"("slug");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Experience_userId_displayOrder_idx" ON "Experience"("userId", "displayOrder");

-- CreateIndex
CREATE INDEX "ExperienceMetric_experienceId_idx" ON "ExperienceMetric"("experienceId");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Testimonial_recipientId_status_idx" ON "Testimonial"("recipientId", "status");

-- CreateIndex
CREATE INDEX "Endorsement_recipientId_idx" ON "Endorsement"("recipientId");

-- CreateIndex
CREATE INDEX "Endorsement_authorId_idx" ON "Endorsement"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Endorsement_authorId_recipientId_skill_key" ON "Endorsement"("authorId", "recipientId", "skill");

-- CreateIndex
CREATE INDEX "Comment_recipientId_idx" ON "Comment"("recipientId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "MediaAsset_userId_idx" ON "MediaAsset"("userId");

-- CreateIndex
CREATE INDEX "MediaAsset_kind_idx" ON "MediaAsset"("kind");

-- CreateIndex
CREATE INDEX "CareerActivity_userId_idx" ON "CareerActivity"("userId");

-- CreateIndex
CREATE INDEX "CareerActivity_date_idx" ON "CareerActivity"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "TailoredResume_userId_idx" ON "TailoredResume"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceMetric" ADD CONSTRAINT "ExperienceMetric_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerActivity" ADD CONSTRAINT "CareerActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TailoredResume" ADD CONSTRAINT "TailoredResume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

