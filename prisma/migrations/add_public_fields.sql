-- Add isPublicOnPublishType and coverImage columns to articles table
-- This migration adds the missing columns needed for the public blog feature

-- Add isPublicOnPublishType column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'isPublicOnPublishType'
    ) THEN
        ALTER TABLE articles 
        ADD COLUMN "isPublicOnPublishType" BOOLEAN NOT NULL DEFAULT false;
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS "articles_status_isPublicOnPublishType_idx" 
        ON articles(status, "isPublicOnPublishType");
    END IF;
END $$;

-- Add coverImage column (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'coverImage'
    ) THEN
        ALTER TABLE articles 
        ADD COLUMN "coverImage" TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND column_name IN ('isPublicOnPublishType', 'coverImage')
ORDER BY column_name;
