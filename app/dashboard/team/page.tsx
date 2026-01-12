'use client';

/**
 * Team Collaboration Page
 * Manage team members and collaboration invitations
 */

import { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit3,
  MessageSquare,
  Trash2,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Invitation {
  id: string;
  role: string;
  status: string;
  invitedAt: string;
  joinedAt?: string;
  expiresAt?: string;
  article: {
    id: string;
    title: string;
    excerpt?: string;
    status: string;
    createdAt: string;
    user: User;
  };
}

const roleIcons = {
  OWNER: <Users className="h-4 w-4" />,
  EDITOR: <Edit3 className="h-4 w-4" />,
  COMMENTER: <MessageSquare className="h-4 w-4" />,
  VIEWER: <Eye className="h-4 w-4" />,
};

const roleColors = {
  OWNER: 'text-purple-600 bg-purple-50',
  EDITOR: 'text-emerald-600 bg-emerald-50',
  COMMENTER: 'text-blue-600 bg-blue-50',
  VIEWER: 'text-neutral-600 bg-neutral-50',
};

export default function TeamPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collaboration/my-invitations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvitations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    try {
      const response = await fetch('/api/collaboration/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ collaboratorId: invitationId }),
      });

      if (response.ok) {
        fetchInvitations();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation');
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return inv.status === 'PENDING';
    if (filter === 'accepted') return inv.status === 'ACCEPTED';
    return true;
  });

  const pendingCount = invitations.filter(inv => inv.status === 'PENDING').length;
  const acceptedCount = invitations.filter(inv => inv.status === 'ACCEPTED').length;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-neutral-900">Team Collaboration</h1>
              <p className="text-[14px] text-neutral-600 mt-1">
                Manage your collaboration invitations and shared articles
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-neutral-900">{invitations.length}</p>
                <p className="text-[12px] text-neutral-600">Total Invitations</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-neutral-900">{pendingCount}</p>
                <p className="text-[12px] text-neutral-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-neutral-900">{acceptedCount}</p>
                <p className="text-[12px] text-neutral-600">Accepted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 mb-6">
          <div className="flex items-center gap-2 p-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-[13px] font-medium rounded transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All ({invitations.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-[13px] font-medium rounded transition-colors ${
                filter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 text-[13px] font-medium rounded transition-colors ${
                filter === 'accepted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Accepted ({acceptedCount})
            </button>
          </div>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-lg border border-neutral-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] text-neutral-600 mt-2">Loading invitations...</p>
            </div>
          ) : filteredInvitations.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-[14px] text-neutral-600">No invitations found</p>
              <p className="text-[12px] text-neutral-500 mt-1">
                You'll see collaboration invitations here when someone shares an article with you
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredInvitations.map((invitation) => (
                <div key={invitation.id} className="p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[15px] font-semibold text-neutral-900">
                          {invitation.article.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded ${roleColors[invitation.role as keyof typeof roleColors]}`}>
                          {roleIcons[invitation.role as keyof typeof roleIcons]}
                          {invitation.role}
                        </span>
                        {invitation.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-yellow-700 bg-yellow-100 rounded">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {invitation.status === 'ACCEPTED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 rounded">
                            <CheckCircle className="h-3 w-3" />
                            Accepted
                          </span>
                        )}
                      </div>

                      {invitation.article.excerpt && (
                        <p className="text-[13px] text-neutral-600 mb-2 line-clamp-2">
                          {invitation.article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                        <span>From: {invitation.article.user.name}</span>
                        <span>•</span>
                        <span>Invited: {new Date(invitation.invitedAt).toLocaleDateString()}</span>
                        {invitation.joinedAt && (
                          <>
                            <span>•</span>
                            <span>Joined: {new Date(invitation.joinedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {invitation.status === 'PENDING' && (
                        <button
                          onClick={() => handleAccept(invitation.id)}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </button>
                      )}
                      {invitation.status === 'ACCEPTED' && (
                        <a
                          href={`/dashboard/articles/${invitation.article.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                          Open Article
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[13px] font-semibold text-blue-900 mb-1">About Team Collaboration</h4>
              <p className="text-[12px] text-blue-700 leading-relaxed">
                When someone shares an article with you, you'll receive an invitation here. Depending on your role, you can view, comment, or edit the article in real-time with other team members.
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-blue-700">
                <li><strong>Viewer:</strong> Can only view the article</li>
                <li><strong>Commenter:</strong> Can view and add comments</li>
                <li><strong>Editor:</strong> Can view, comment, and edit the article in real-time</li>
                <li><strong>Owner:</strong> Full access including managing collaborators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
