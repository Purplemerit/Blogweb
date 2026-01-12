'use client';

/**
 * Image Library Component
 * Comprehensive image management UI with upload, AI generation, and stock images
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageData {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  alt?: string;
  caption?: string;
  source: 'UPLOAD' | 'AI_GENERATED' | 'STOCK_PEXELS' | 'STOCK_UNSPLASH';
  createdAt: string;
}

interface StockImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  description: string;
  provider: 'pexels' | 'unsplash';
}

interface ImageLibraryProps {
  onSelect?: (image: ImageData) => void;
  articleId?: string;
  multiSelect?: boolean;
}

export default function ImageLibrary({
  onSelect,
  articleId,
  multiSelect = false,
}: ImageLibraryProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'ai' | 'stock'>('library');
  const [images, setImages] = useState<ImageData[]>([]);
  const [stockImages, setStockImages] = useState<StockImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');

  // AI generation states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiProvider, setAiProvider] = useState<'stability' | 'openai'>('stability');
  const [aiSize, setAiSize] = useState('1024x1024');

  // Stock search states
  const [stockQuery, setStockQuery] = useState('');
  const [stockProvider, setStockProvider] = useState<'pexels' | 'unsplash'>('pexels');
  const [stockPage, setStockPage] = useState(1);

  // Fetch user images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = new URL('/api/images/upload', window.location.origin);
      if (articleId) url.searchParams.append('articleId', articleId);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setImages(data.data.images);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search stock images
  const searchStockImages = async () => {
    if (!stockQuery.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = new URL('/api/images/stock', window.location.origin);
      url.searchParams.append('query', stockQuery);
      url.searchParams.append('provider', stockProvider);
      url.searchParams.append('page', stockPage.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStockImages(data.data.results);
      }
    } catch (error) {
      console.error('Failed to search stock images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', uploadFile);
      if (articleId) formData.append('articleId', articleId);
      if (uploadAlt) formData.append('alt', uploadAlt);
      if (uploadCaption) formData.append('caption', uploadCaption);
      formData.append('optimize', 'true');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImages([data.data, ...images]);
        setUploadFile(null);
        setUploadAlt('');
        setUploadCaption('');
        setActiveTab('library');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle AI generation
  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;

    setGenerating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          provider: aiProvider,
          size: aiSize,
          articleId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setImages([data.data, ...images]);
        setAiPrompt('');
        setActiveTab('library');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle stock image download
  const handleStockDownload = async (stockImage: StockImage) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/images/stock', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: stockImage.url,
          provider: stockImage.provider,
          articleId,
          alt: stockImage.description,
          photographer: stockImage.photographer,
          photographerUrl: stockImage.photographerUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setImages([data.data, ...images]);
        setActiveTab('library');
      }
    } catch (error) {
      console.error('Stock download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (image: ImageData) => {
    if (multiSelect) {
      const newSelected = new Set(selectedImages);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      setSelectedImages(newSelected);
    } else {
      if (onSelect) {
        onSelect(image);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'library') {
      fetchImages();
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'library'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'ai'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          AI Generate
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'stock'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Stock Images
        </button>
      </div>

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No images yet. Upload, generate, or add stock images to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleImageSelect(image)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImages.has(image.id)
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.alt || image.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                    <p className="truncate">{image.filename}</p>
                    <p className="text-gray-300">{image.source}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Choose File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alt Text</label>
            <input
              type="text"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Descriptive alt text for accessibility"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Caption</label>
            <textarea
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Image caption (optional)"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      {/* AI Generation Tab */}
      {activeTab === 'ai' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Describe the image you want to generate..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="stability">Stability AI</option>
                <option value="openai">OpenAI DALL-E</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <select
                value={aiSize}
                onChange={(e) => setAiSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="1024x1024">1024x1024</option>
                <option value="1792x1024">1792x1024 (Wide)</option>
                <option value="1024x1792">1024x1792 (Tall)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAIGeneration}
            disabled={!aiPrompt.trim() || generating}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400"
          >
            {generating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      )}

      {/* Stock Images Tab */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchStockImages()}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Search stock images..."
            />
            <select
              value={stockProvider}
              onChange={(e) => setStockProvider(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="pexels">Pexels</option>
              <option value="unsplash">Unsplash</option>
            </select>
            <button
              onClick={searchStockImages}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">Searching...</div>
          ) : stockImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Search for stock images to get started
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stockImages.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={image.thumbnailUrl}
                    alt={image.description}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleStockDownload(image)}
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium"
                    >
                      Use Image
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                    <p className="truncate">by {image.photographer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
