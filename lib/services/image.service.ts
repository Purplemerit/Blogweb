/**
 * Image Service
 * Centralized service for image management, optimization, and processing
 */

import prisma from '@/lib/prisma';
import { CloudinaryService } from './cloudinary.service';
import sharp from 'sharp';

export interface ImageUploadOptions {
  userId: string;
  articleId?: string;
  alt?: string;
  caption?: string;
  optimize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  mimeType: string;
}

export class ImageService {
  private static readonly MAX_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || '10485760'); // 10MB
  private static readonly ALLOWED_TYPES = (
    process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif'
  ).split(',');
  private static readonly DEFAULT_QUALITY = parseInt(process.env.IMAGE_QUALITY || '80');

  /**
   * Upload and process image
   */
  static async uploadImage(
    file: File | Buffer,
    options: ImageUploadOptions
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Convert File to Buffer if needed
      let buffer: Buffer;
      let originalFilename: string;
      let mimeType: string;

      if (file instanceof File) {
        buffer = Buffer.from(await file.arrayBuffer());
        originalFilename = file.name;
        mimeType = file.type;

        // Validate file type
        if (!this.ALLOWED_TYPES.includes(mimeType)) {
          return {
            success: false,
            error: `Invalid file type. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`,
          };
        }

        // Validate file size
        if (buffer.length > this.MAX_SIZE) {
          return {
            success: false,
            error: `File too large. Maximum size: ${this.MAX_SIZE / 1024 / 1024}MB`,
          };
        }
      } else {
        buffer = file;
        originalFilename = `image_${Date.now()}.jpg`;
        mimeType = 'image/jpeg';
      }

      // Optimize image if requested
      if (options.optimize !== false) {
        buffer = await this.optimizeImage(buffer, {
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          quality: options.quality || this.DEFAULT_QUALITY,
        });
      }

      // Get image metadata
      const metadata = await this.getImageMetadata(buffer);

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadImage(buffer, {
        folder: 'blogweb/articles',
        filename: originalFilename.replace(/\.[^/.]+$/, ''), // Remove extension
      });

      if (!uploadResult.success || !uploadResult.data) {
        return {
          success: false,
          error: uploadResult.error || 'Failed to upload image',
        };
      }

      // Save to database
      const image = await prisma.image.create({
        data: {
          userId: options.userId,
          articleId: options.articleId || null,
          url: uploadResult.data.secureUrl,
          thumbnailUrl: uploadResult.data.thumbnailUrl,
          filename: originalFilename,
          mimeType: mimeType,
          size: uploadResult.data.bytes,
          width: metadata.width,
          height: metadata.height,
          alt: options.alt || '',
          caption: options.caption || '',
          source: 'UPLOAD',
        },
      });

      // Update usage stats
      await this.updateUsageStats(options.userId);

      return {
        success: true,
        data: image,
      };
    } catch (error: any) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      };
    }
  }

  /**
   * Optimize image using Sharp
   */
  static async optimizeImage(
    buffer: Buffer,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    }
  ): Promise<Buffer> {
    try {
      let image = sharp(buffer);

      // Get metadata to determine orientation
      const metadata = await image.metadata();

      // Resize if dimensions are provided
      if (options?.maxWidth || options?.maxHeight) {
        image = image.resize({
          width: options.maxWidth,
          height: options.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Apply format-specific optimization
      const format = options?.format || 'jpeg';
      const quality = options?.quality || this.DEFAULT_QUALITY;

      switch (format) {
        case 'jpeg':
          image = image.jpeg({ quality, progressive: true });
          break;
        case 'png':
          image = image.png({ quality, progressive: true, compressionLevel: 9 });
          break;
        case 'webp':
          image = image.webp({ quality });
          break;
      }

      return await image.toBuffer();
    } catch (error: any) {
      console.error('Image optimization error:', error);
      // Return original buffer if optimization fails
      return buffer;
    }
  }

  /**
   * Get image metadata using Sharp
   */
  static async getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
    try {
      const metadata = await sharp(buffer).metadata();

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: buffer.length,
        mimeType: `image/${metadata.format}`,
      };
    } catch (error) {
      console.error('Failed to get image metadata:', error);
      return {
        width: 0,
        height: 0,
        format: 'unknown',
        size: buffer.length,
        mimeType: 'image/jpeg',
      };
    }
  }

  /**
   * Get user's images
   */
  static async getUserImages(
    userId: string,
    options?: {
      articleId?: string;
      limit?: number;
      offset?: number;
      source?: 'UPLOAD' | 'AI_GENERATED' | 'STOCK_PEXELS' | 'STOCK_UNSPLASH';
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const where: any = { userId };

      if (options?.articleId) {
        where.articleId = options.articleId;
      }

      if (options?.source) {
        where.source = options.source;
      }

      const images = await prisma.image.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      });

      const total = await prisma.image.count({ where });

      return {
        success: true,
        data: {
          images,
          total,
          hasMore: total > (options?.offset || 0) + images.length,
        },
      };
    } catch (error: any) {
      console.error('Get images error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get images',
      };
    }
  }

  /**
   * Delete image
   */
  static async deleteImage(
    imageId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get image
      const image = await prisma.image.findFirst({
        where: { id: imageId, userId },
      });

      if (!image) {
        return {
          success: false,
          error: 'Image not found',
        };
      }

      // Extract public ID from URL
      const publicId = this.extractPublicIdFromUrl(image.url);

      if (publicId && image.source === 'UPLOAD') {
        // Delete from Cloudinary
        await CloudinaryService.deleteImage(publicId);
      }

      // Delete from database
      await prisma.image.delete({
        where: { id: imageId },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Delete image error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image',
      };
    }
  }

  /**
   * Batch delete images
   */
  static async batchDeleteImages(
    imageIds: string[],
    userId: string
  ): Promise<{ success: boolean; deleted: number; failed: number; error?: string }> {
    try {
      // Get images
      const images = await prisma.image.findMany({
        where: {
          id: { in: imageIds },
          userId,
        },
      });

      if (images.length === 0) {
        return {
          success: false,
          deleted: 0,
          failed: imageIds.length,
          error: 'No images found',
        };
      }

      // Extract public IDs
      const publicIds = images
        .filter((img) => img.source === 'UPLOAD')
        .map((img) => this.extractPublicIdFromUrl(img.url))
        .filter((id) => id !== null) as string[];

      // Delete from Cloudinary
      if (publicIds.length > 0) {
        await CloudinaryService.batchDelete(publicIds);
      }

      // Delete from database
      const deleteResult = await prisma.image.deleteMany({
        where: {
          id: { in: images.map((img) => img.id) },
        },
      });

      return {
        success: true,
        deleted: deleteResult.count,
        failed: imageIds.length - deleteResult.count,
      };
    } catch (error: any) {
      console.error('Batch delete error:', error);
      return {
        success: false,
        deleted: 0,
        failed: imageIds.length,
        error: error.message || 'Failed to delete images',
      };
    }
  }

  /**
   * Update image metadata
   */
  static async updateImage(
    imageId: string,
    userId: string,
    data: { alt?: string; caption?: string; articleId?: string }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const image = await prisma.image.updateMany({
        where: { id: imageId, userId },
        data: {
          alt: data.alt,
          caption: data.caption,
          articleId: data.articleId,
        },
      });

      if (image.count === 0) {
        return {
          success: false,
          error: 'Image not found',
        };
      }

      const updatedImage = await prisma.image.findUnique({
        where: { id: imageId },
      });

      return {
        success: true,
        data: updatedImage,
      };
    } catch (error: any) {
      console.error('Update image error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update image',
      };
    }
  }

  /**
   * Extract Cloudinary public ID from URL
   */
  private static extractPublicIdFromUrl(url: string): string | null {
    try {
      // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
      const match = url.match(/\/v\d+\/(.+?)(\.[a-z]+)?$/i);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Update usage stats for image uploads
   */
  private static async updateUsageStats(userId: string): Promise<void> {
    try {
      await prisma.usageStats.upsert({
        where: { userId },
        update: {
          imagesGeneratedThisMonth: { increment: 1 },
        },
        create: {
          userId,
          imagesGeneratedThisMonth: 1,
        },
      });
    } catch (error) {
      console.error('Failed to update usage stats:', error);
    }
  }

  /**
   * Get image statistics for user
   */
  static async getImageStats(userId: string): Promise<{
    success: boolean;
    data?: {
      total: number;
      bySource: Record<string, number>;
      totalSize: number;
      thisMonth: number;
    };
    error?: string;
  }> {
    try {
      const images = await prisma.image.findMany({
        where: { userId },
        select: {
          source: true,
          size: true,
          createdAt: true,
        },
      });

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const bySource: Record<string, number> = {};
      let totalSize = 0;
      let thisMonth = 0;

      images.forEach((img) => {
        bySource[img.source] = (bySource[img.source] || 0) + 1;
        totalSize += img.size;
        if (img.createdAt >= firstDayOfMonth) {
          thisMonth++;
        }
      });

      return {
        success: true,
        data: {
          total: images.length,
          bySource,
          totalSize,
          thisMonth,
        },
      };
    } catch (error: any) {
      console.error('Get image stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get image stats',
      };
    }
  }
}
