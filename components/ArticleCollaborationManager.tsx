'use client';

/**
 * Article Collaboration Manager
 * Select an article and invite collaborators to work together in real-time
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  UserPlus,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  MessageSquare,
  Trash2,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishRecords?: Array<{
    platform: string;
    url?: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Collaborator {
  id: string;
  userId: string;
  role: string;
  status: string;
  invitedAt: string;
  joinedAt?: string;
  user: User;
}

const roleOptions = [
  { value: 'VIEWER', label: 'Viewer', icon: Eye, description: 'Can only view the article' },
  { value: 'COMMENTER', label: 'Commenter', icon: MessageSquare, description: 'Can view and comment' },
  { value: 'EDITOR', label: 'Editor', icon: Edit3, description: 'Can edit in real-time' },
];

export default function ArticleCollaborationManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState('EDITOR');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [fixingStatus, setFixingStatus] = useState(false);

  // Fetch user's articles
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch collaborators when article is selected
  useEffect(() => {
    if (selectedArticle) {
      fetchCollaborators(selectedArticle.id);
    }
  }, [selectedArticle]);

  // Search users with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Articles API response:', data);

        // Handle different response structures
        if (Array.isArray(data)) {
          setArticles(data);
        } else if (data.data && data.data.articles && Array.isArray(data.data.articles)) {
          // API returns { success: true, data: { articles: [...], pagination: {...} } }
          setArticles(data.data.articles);
        } else if (data.data && Array.isArray(data.data)) {
          setArticles(data.data);
        } else if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          console.warn('Unexpected articles response structure:', data);
          setArticles([]);
        }
      } else {
        console.error('Failed to fetch articles:', response.status);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async (articleId: string) => {
    try {
      const response = await fetch(`/api/collaboration/invite?articleId=${articleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      setSearching(true);
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleInvite = async (user: User) => {
    if (!selectedArticle) return;

    try {
      const response = await fetch('/api/collaboration/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          articleId: selectedArticle.id,
          email: user.email,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        alert(`Invitation sent to ${user.name}!`);
        setSearchQuery('');
        setSearchResults([]);
        fetchCollaborators(selectedArticle.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!confirm('Are you sure you want to remove this collaborator?')) return;

    try {
      const response = await fetch(`/api/collaboration/invite?collaboratorId=${collaboratorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok && selectedArticle) {
        fetchCollaborators(selectedArticle.id);
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const handleOpenArticle = () => {
    if (selectedArticle) {
      window.location.href = `/dashboard/articles/${selectedArticle.id}/edit`;
    }
  };

  const isAlreadyCollaborator = (userId: string) => {
    return collaborators.some(c => c.userId === userId);
  };

  const handleFixArticleStatus = async () => {
    if (!confirm('This will update all your published articles to show as PUBLISHED. Continue?')) return;

    try {
      setFixingStatus(true);
      const response = await fetch('/api/articles/fix-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Success! Updated ${data.data.count} articles to PUBLISHED status.`);
        // Refresh articles list
        fetchArticles();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to fix article status');
      }
    } catch (error) {
      console.error('Error fixing article status:', error);
      alert('Failed to fix article status');
    } finally {
      setFixingStatus(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-neutral-900">Article Collaboration</h1>
              <p className="text-[14px] text-neutral-600 mt-1">
                Select an article and invite team members to collaborate in real-time
              </p>
            </div>
            <button
              onClick={handleFixArticleStatus}
              disabled={fixingStatus}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
            >
              {fixingStatus ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Fix Published Status
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Article Selection */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-neutral-700" />
              <h2 className="text-[16px] font-semibold text-neutral-900">Select Article</h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {(articles || []).map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedArticle?.id === article.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-1">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-[12px] text-neutral-600 line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <span className={`px-2 py-0.5 rounded ${
                        article.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                        article.status === 'DRAFT' ? 'bg-neutral-100 text-neutral-700' :
                        article.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                        'bg-neutral-100 text-neutral-700'
                      }`}>
                        {article.status}
                      </span>
                      {article.publishRecords && article.publishRecords.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600">
                            Published on {article.publishRecords.length} platform{article.publishRecords.length > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}

                {(!articles || articles.length === 0) && (
                  <div className="text-center py-8 text-neutral-500 text-[13px]">
                    No articles found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Collaborator Management */}
          <div className="space-y-6">
            {selectedArticle ? (
              <>
                {/* Selected Article Info */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-emerald-900 mb-1">
                        {selectedArticle.title}
                      </h3>
                      <p className="text-[12px] text-emerald-700">
                        Manage collaborators for this article
                      </p>
                    </div>
                    <button
                      onClick={handleOpenArticle}
                      className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                    >
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Invite Users */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5 text-neutral-700" />
                    <h2 className="text-[16px] font-semibold text-neutral-900">Invite Collaborators</h2>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-neutral-900"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="block text-[12px] font-medium text-neutral-700 mb-2">
                      Select Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleOptions.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            onClick={() => setSelectedRole(role.value)}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              selectedRole === role.value
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            <Icon className="h-4 w-4 mb-1 text-neutral-700" />
                            <p className="text-[12px] font-semibold text-neutral-900">
                              {role.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchQuery.length >= 2 && (
                    <div className="border border-neutral-200 rounded-lg max-h-60 overflow-y-auto">
                      {searching ? (
                        <div className="p-4 text-center text-[13px] text-neutral-500">
                          Searching...
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-[13px] text-neutral-500">
                          No users found
                        </div>
                      ) : (
                        searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-[12px]">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-neutral-900">
                                  {user.name}
                                </p>
                                <p className="text-[11px] text-neutral-600">{user.email}</p>
                              </div>
                            </div>
                            {isAlreadyCollaborator(user.id) ? (
                              <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Already added
                              </span>
                            ) : (
                              <button
                                onClick={() => handleInvite(user)}
                                className="px-3 py-1.5 text-[12px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                              >
                                Invite
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Current Collaborators */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-neutral-700" />
                    <h2 className="text-[16px] font-semibold text-neutral-900">
                      Collaborators ({collaborators.length})
                    </h2>
                  </div>

                  {collaborators.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500 text-[13px]">
                      No collaborators yet. Invite someone to get started!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {collaborators.map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-[12px]">
                              {collaborator.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-neutral-900">
                                {collaborator.user.name}
                              </p>
                              <p className="text-[11px] text-neutral-600">
                                {collaborator.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-[11px] font-medium bg-neutral-100 text-neutral-700 rounded">
                              {collaborator.role}
                            </span>
                            {collaborator.status === 'PENDING' ? (
                              <span className="px-2 py-1 text-[11px] font-medium bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                Pending
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-[11px] font-medium bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveCollaborator(collaborator.id)}
                              className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-[14px] text-neutral-600">
                  Select an article from the left to manage collaborators
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
