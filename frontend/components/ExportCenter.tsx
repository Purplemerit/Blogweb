'use client';

/**
 * Export Center Component
 * Comprehensive export UI for articles and analytics
 */

import React, { useState, useEffect } from 'react';
import { Download, FileText, Package, BarChart3 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  status: string;
  publishedAt: string | null;
  wordCount: number;
  createdAt: string;
}

interface ExportCenterProps {
  defaultTab?: 'articles' | 'analytics' | 'bulk';
}

export default function ExportCenter({ defaultTab = 'articles' }: ExportCenterProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'analytics' | 'bulk'>(defaultTab);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Article export states
  const [singleArticleId, setSingleArticleId] = useState('');
  const [format, setFormat] = useState<'pdf' | 'docx' | 'markdown' | 'html' | 'json'>('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);

  // Bulk export states
  const [bulkFormat, setBulkFormat] = useState<'csv' | 'json' | 'pdf' | 'docx'>('csv');

  // Analytics export states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = ['DEVTO', 'WORDPRESS', 'HASHNODE', 'GHOST', 'WIX', 'MEDIUM', 'LINKEDIN'];

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setArticles(data.data.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export single article
  const exportArticle = async () => {
    if (!singleArticleId) {
      alert('Please select an article');
      return;
    }

    setExporting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = new URL(`/api/articles/${singleArticleId}/export`, window.location.origin);
      url.searchParams.append('format', format);
      url.searchParams.append('includeMetadata', includeMetadata.toString());
      url.searchParams.append('includeImages', includeImages.toString());
      url.searchParams.append('includeTags', includeTags.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `article.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        alert('Article exported successfully!');
      } else {
        alert('Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  };

  // Bulk export
  const bulkExport = async () => {
    if (selectedArticles.size === 0) {
      alert('Please select at least one article');
      return;
    }

    setExporting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/export/bulk', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleIds: Array.from(selectedArticles),
          format: bulkFormat,
          includeMetadata,
          includeImages,
          includeTags,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `articles_export.${bulkFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        alert('Articles exported successfully!');
        setSelectedArticles(new Set());
      } else {
        alert('Bulk export failed');
      }
    } catch (error) {
      console.error('Bulk export failed:', error);
      alert('Bulk export failed');
    } finally {
      setExporting(false);
    }
  };

  // Export analytics
  const exportAnalytics = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = new URL('/api/export/analytics', window.location.origin);
      if (startDate) url.searchParams.append('startDate', startDate);
      if (endDate) url.searchParams.append('endDate', endDate);
      if (selectedPlatforms.length > 0) {
        url.searchParams.append('platforms', selectedPlatforms.join(','));
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'analytics_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        alert('Analytics exported successfully!');
      } else {
        alert('Analytics export failed');
      }
    } catch (error) {
      console.error('Analytics export failed:', error);
      alert('Analytics export failed');
    } finally {
      setExporting(false);
    }
  };

  // Toggle article selection
  const toggleArticleSelection = (articleId: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.add(articleId);
    }
    setSelectedArticles(newSelected);
  };

  // Select all articles
  const selectAllArticles = () => {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map((a) => a.id)));
    }
  };

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  useEffect(() => {
    if (activeTab === 'articles' || activeTab === 'bulk') {
      fetchArticles();
    }
  }, [activeTab]);

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200">
        <h1 className="text-[26px] font-bold text-neutral-900 mb-1 tracking-tight">
          Export Center
        </h1>
        <p className="text-[13px] text-neutral-500">
          Export your articles and analytics data in various formats
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 px-8">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-4 text-[13px] font-medium relative ${
            activeTab === 'articles'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Single Article
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-6 py-4 text-[13px] font-medium relative ${
            activeTab === 'bulk'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Bulk Export
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-4 text-[13px] font-medium relative ${
            activeTab === 'analytics'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics Data
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Single Article Export */}
        {activeTab === 'articles' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                Select Article
              </label>
              <select
                value={singleArticleId}
                onChange={(e) => setSingleArticleId(e.target.value)}
                className="w-full px-4 py-3 text-[13px] border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Choose an article...</option>
                {articles.map((article) => (
                  <option key={article.id} value={article.id}>
                    {article.title} ({article.status})
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-[12px] text-neutral-500 mt-2">Loading articles...</p>
              )}
              {!loading && articles.length === 0 && (
                <p className="text-[12px] text-neutral-500 mt-2">No articles found</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  Export Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-4 py-3 text-[13px] border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="docx">Word (DOCX)</option>
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  Options
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[13px] text-neutral-700">Include Metadata</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[13px] text-neutral-700">Include Images</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTags}
                    onChange={(e) => setIncludeTags(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[13px] text-neutral-700">Include Tags</span>
                </label>
              </div>
            </div>

            <button
              onClick={exportArticle}
              disabled={!singleArticleId || exporting}
              className="w-full py-3 px-4 bg-emerald-600 text-white text-[13px] font-medium rounded-lg hover:bg-emerald-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Article
                </>
              )}
            </button>
          </div>
        )}

        {/* Bulk Export */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[13px] font-medium text-neutral-700">
                  Select Articles ({selectedArticles.size} selected)
                </label>
                <button
                  onClick={selectAllArticles}
                  className="text-[13px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {selectedArticles.size === articles.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto border border-neutral-200 rounded-lg">
                {loading ? (
                  <div className="p-8 text-center text-neutral-500 text-[13px]">
                    Loading articles...
                  </div>
                ) : articles.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-[13px]">
                    No articles found
                  </div>
                ) : (
                  articles.map((article) => (
                    <label
                      key={article.id}
                      className="flex items-center p-4 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedArticles.has(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[13px] text-neutral-900">
                          {article.title}
                        </p>
                        <p className="text-[12px] text-neutral-500 mt-0.5">
                          {article.status} • {article.wordCount} words
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="max-w-2xl">
              <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                Export Format
              </label>
              <select
                value={bulkFormat}
                onChange={(e) => setBulkFormat(e.target.value as any)}
                className="w-full px-4 py-3 text-[13px] border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="json">JSON</option>
              </select>
              <p className="text-[12px] text-neutral-500 mt-2">
                CSV is recommended for bulk exports with metadata
              </p>
            </div>

            <button
              onClick={bulkExport}
              disabled={selectedArticles.size === 0 || exporting}
              className="w-full max-w-2xl py-3 px-4 bg-emerald-600 text-white text-[13px] font-medium rounded-lg hover:bg-emerald-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {selectedArticles.size} Article(s)
                </>
              )}
            </button>
          </div>
        )}

        {/* Analytics Export */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 text-[13px] border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 text-[13px] border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-3">
                Platforms (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[13px] text-neutral-700">{platform}</span>
                  </label>
                ))}
              </div>
              <p className="text-[12px] text-neutral-500 mt-2">
                Leave empty to export all platforms
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-medium text-[13px] text-emerald-900 mb-2">
                Export Includes:
              </h3>
              <ul className="text-[12px] text-emerald-800 space-y-1">
                <li>• Article titles and platforms</li>
                <li>• Views, likes, comments, shares</li>
                <li>• Unique visitors (where available)</li>
                <li>• Publication dates and URLs</li>
                <li>• Last sync timestamps</li>
              </ul>
            </div>

            <button
              onClick={exportAnalytics}
              disabled={exporting}
              className="w-full py-3 px-4 bg-emerald-600 text-white text-[13px] font-medium rounded-lg hover:bg-emerald-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics (CSV)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
