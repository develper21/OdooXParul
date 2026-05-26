"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Link2, 
  Hash, 
  X, 
  Check, 
  Clock, 
  MoreVertical,
  Copy,
  Share2,
  Loader2,
  User,
  Shield,
  Settings
} from "lucide-react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { TripMemberWithUser, Invitation } from "@/lib/types";

interface TripCrewManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  tripDestination: string;
  joinCode?: string;
  onMemberAdded?: () => void;
}

interface SearchResult {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
}

export default function TripCrewManager({ 
  isOpen, 
  onClose, 
  tripId, 
  tripTitle, 
  tripDestination,
  joinCode,
  onMemberAdded 
}: TripCrewManagerProps) {
  const [activeTab, setActiveTab] = useState<"invite" | "members" | "pending">("invite");
  const [inviteMethod, setInviteMethod] = useState<"search" | "email" | "link" | "code">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<TripMemberWithUser[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; name?: string; email: string } | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Fetch members and pending invitations
  useEffect(() => {
    if (isOpen && tripId) {
      Promise.all([
        apiGet<{ success: boolean; data: TripMemberWithUser[] }>(`/api/trips/${tripId}/members`),
        apiGet<{ success: boolean; data: Invitation[] }>(`/api/trips/${tripId}/invitations`)
      ]).then(([membersRes, invitesRes]) => {
        setMembers(membersRes.data || []);
        setPendingInvitations(invitesRes.data || []);
      }).catch(console.error);

      apiGet<{ success: boolean; data: any }>("/api/auth/me")
        .then((res) => setCurrentUser(res.data))
        .catch(() => setCurrentUser(null));
    }
  }, [isOpen, tripId]);

  // Search users
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchLoading(true);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      
      searchTimeout.current = setTimeout(() => {
        apiGet<{ success: boolean; data: SearchResult[] }>(`/api/users/search?q=${encodeURIComponent(searchQuery)}&excludeTripId=${tripId}`)
          .then(res => {
            setSearchResults(res.data || []);
            setSearchLoading(false);
          })
          .catch(() => setSearchLoading(false));
      }, 300);
    } else {
      setSearchResults([]);
      setSearchLoading(false);
    }

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, tripId]);

  const handleInviteUser = async (user: SearchResult) => {
    setLoading(true);
    try {
      const invitedBy = currentUser?.name || currentUser?.email || "Trip Organizer";
      await apiPost(`/api/invitations`, {
        tripId,
        tripTitle,
        tripDestination,
        invitedEmail: user.email,
        invitedUserId: user.id,
        invitedBy,
        inviteMethod: "search"
      });
      
      setSearchQuery("");
      setSearchResults([]);
      
      const invitesRes = await apiGet<{ success: boolean; data: Invitation[] }>(`/api/trips/${tripId}/invitations`);
      setPendingInvitations(invitesRes.data || []);
      
      onMemberAdded?.();
    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const invitedBy = currentUser?.name || currentUser?.email || "Trip Organizer";
      await apiPost(`/api/invitations`, {
        tripId,
        tripTitle,
        tripDestination,
        invitedEmail: email,
        invitedBy,
        inviteMethod: "email"
      });
      
      setEmail("");
      
      const invitesRes = await apiGet<{ success: boolean; data: Invitation[] }>(`/api/trips/${tripId}/invitations`);
      setPendingInvitations(invitesRes.data || []);
      
      onMemberAdded?.();
    } catch (error) {
      console.error("Failed to invite by email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await apiDelete(`/api/trips/${tripId}/invitations?invitationId=${invitationId}`);
      
      const invitesRes = await apiGet<{ success: boolean; data: Invitation[] }>(`/api/trips/${tripId}/invitations`);
      setPendingInvitations(invitesRes.data || []);
      
      onMemberAdded?.();
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
    }
  };

  const createShareLink = async () => {
    if (shareLink || shareLoading) return shareLink;
    setShareLoading(true);
    setShareError(null);

    try {
      const invitedBy = currentUser?.name || currentUser?.email || "Trip Organizer";
      const result = await apiPost<{ success: boolean; data: Invitation }>(`/api/invitations`, {
        tripId,
        tripTitle,
        tripDestination,
        invitedBy,
        inviteMethod: "link",
      });

      const url = `${window.location.origin}/invite/${result.data.token}`;
      setShareLink(url);
      setPendingInvitations((prev) => [result.data, ...prev]);
      return url;
    } catch (error: any) {
      setShareError(error.message || "Unable to generate link");
      throw error;
    } finally {
      setShareLoading(false);
    }
  };

  const copyInviteLink = async () => {
    try {
      const inviteUrl = shareLink || await createShareLink();
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const copyJoinCode = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="w-3 h-3 text-yellow-400" />;
      case "organizer": return <Shield className="w-3 h-3 text-blue-400" />;
      default: return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0f1c] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Trip Crew</h2>
                  <p className="text-white/60 text-sm">{tripTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
              {[
                { id: "invite", label: "Invite", icon: UserPlus },
                { id: "members", label: "Members", icon: Users },
                { id: "pending", label: "Pending", icon: Clock }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                    activeTab === id
                      ? "bg-purple-600 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Invite Tab */}
            {activeTab === "invite" && (
              <div className="space-y-6">
                {/* Invite Method Selector */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "search", label: "Find Users", icon: Search, desc: "Search platform users" },
                    { id: "email", label: "Email Invite", icon: Mail, desc: "Send via email" },
                    { id: "link", label: "Share Link", icon: Link2, desc: "Copy invite link" },
                    { id: "code", label: "Join Code", icon: Hash, desc: "Share 6-digit code" }
                  ].map(({ id, label, icon: Icon, desc }) => (
                    <button
                      key={id}
                      onClick={() => setInviteMethod(id as any)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        inviteMethod === id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-purple-400 mb-2" />
                      <h3 className="text-white font-medium">{label}</h3>
                      <p className="text-white/40 text-sm">{desc}</p>
                    </button>
                  ))}
                </div>

                {/* Invite Method Content */}
                {inviteMethod === "search" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                      />
                      {searchLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-spin" />
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                                {user.name?.charAt(0) || user.email.charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name || 'New User'}</p>
                                <p className="text-white/40 text-sm">{user.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleInviteUser(user)}
                              disabled={loading}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              Invite
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {inviteMethod === "email" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="friend@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <button
                      onClick={handleInviteEmail}
                      disabled={!email || loading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send Invitation"}
                    </button>
                  </div>
                )}

                {inviteMethod === "link" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-white/60 text-sm mb-3">Generate a shareable invite link:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={shareLink || "Create a link to share with anyone"}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                        />
                        <button
                          onClick={copyInviteLink}
                          disabled={shareLoading}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {shareLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {shareError && <p className="text-red-300 text-xs mt-2">{shareError}</p>}
                      <p className="text-white/40 text-xs mt-2">Friends can open this link to accept the invitation.</p>
                    </div>
                  </div>
                )}

                {inviteMethod === "code" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-white/60 text-sm mb-3">Share this 6-digit code:</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-center">
                          <span className="text-2xl font-mono font-bold text-purple-400">{joinCode || "------"}</span>
                        </div>
                        <button
                          onClick={copyJoinCode}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-white/40 text-xs mt-2">Friends can join at /join</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-3">
                {members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No members yet</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">
                              {member.user?.name || member.user?.email || 'Unknown User'}
                            </p>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-white/40 text-sm capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.status === "pending" && (
                        <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg">
                          Pending
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Tab */}
            {activeTab === "pending" && (
              <div className="space-y-3">
                {pendingInvitations.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No pending invitations</p>
                  </div>
                ) : (
                  pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{invitation.invitedEmail}</p>
                        <p className="text-white/40 text-sm capitalize">
                          {invitation.inviteMethod} • {new Date(invitation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2H5v2h14v-2z"/>
    </svg>
  );
}
