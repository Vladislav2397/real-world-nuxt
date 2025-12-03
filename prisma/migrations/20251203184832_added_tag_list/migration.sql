-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "tagList" TEXT[] DEFAULT ARRAY[]::TEXT[];
