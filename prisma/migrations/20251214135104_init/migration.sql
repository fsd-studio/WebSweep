-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "canton" TEXT,
    "category" TEXT,
    "geoMetrics" JSONB,
    "seoMetrics" JSONB,
    "performanceMetrics" JSONB,
    "validationMetrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
