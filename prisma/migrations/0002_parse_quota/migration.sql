-- Per-user daily cap on AI resume parses (free tier abuse guard).
ALTER TABLE "User" ADD COLUMN "parseCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "parseWindowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
