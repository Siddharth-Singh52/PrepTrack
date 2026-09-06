import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  User,
  Mail,
  Briefcase,
  Code2,
  Github,
  Linkedin,
  Globe,
  Save,
  CheckCircle,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    targetRole: '',
    skills: '',
    github: '',
    linkedin: '',
    leetcode: '',
    portfolio: '',
  });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.success) {
        const p = res.profile;
        setProfileData({
          name: p.name || '',
          email: p.email || '',
          targetRole: p.targetRole || 'Software Engineer',
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
          github: p.github || '',
          linkedin: p.linkedin || '',
          leetcode: p.leetcode || '',
          portfolio: p.portfolio || '',
        });
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await profileService.updateProfile({
        name: profileData.name,
        targetRole: profileData.targetRole,
        skills: profileData.skills,
        github: profileData.github,
        linkedin: profileData.linkedin,
        leetcode: profileData.leetcode,
        portfolio: profileData.portfolio,
      });

      if (res.success) {
        updateUser(res.profile);
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading candidate profile..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Candidate Profile & Settings</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage your career target parameters and coding profiles
        </p>
      </div>

      {/* Stats Summary Card */}
      {stats && (
        <Card className="p-5 bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg font-bold text-emerald-400">
              {profileData.name.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">{profileData.name}</h3>
              <p className="text-xs text-zinc-400">{profileData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/80">
            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-500">DSA Solved</span>
              <p className="text-base font-bold text-zinc-100 font-mono">
                {stats.completedDSA} / {stats.totalQuestions}
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-500">Curriculum Readiness</span>
              <p className="text-base font-bold text-emerald-400 font-mono">
                {stats.prepPercentage}%
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-500">Applications</span>
              <p className="text-base font-bold text-zinc-100 font-mono">
                {stats.totalApplications}
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-500">Offers</span>
              <p className="text-base font-bold text-emerald-400 font-mono">{stats.offers}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={profileData.targetRole}
                  onChange={(e) => setProfileData({ ...profileData, targetRole: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Core Skills (comma separated)</label>
            <div className="relative">
              <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS"
                value={profileData.skills}
                onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">GitHub Profile URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profileData.github}
                  onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">LeetCode Handle</label>
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. leetcode_ninja"
                  value={profileData.leetcode}
                  onChange={(e) => setProfileData({ ...profileData, leetcode: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Portfolio Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://myportfolio.dev"
                  value={profileData.portfolio}
                  onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            {successNotice ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : (
              <div />
            )}

            <Button type="submit" variant="primary" loading={saving} icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
