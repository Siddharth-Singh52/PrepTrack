import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';

export const PlacementModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    jobType: 'Full-Time',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    applicationLink: '',
    interviewDate: '',
    salary: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        location: initialData.location || '',
        jobType: initialData.jobType || 'Full-Time',
        status: initialData.status || 'Applied',
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        applicationLink: initialData.applicationLink || '',
        interviewDate: initialData.interviewDate
          ? new Date(initialData.interviewDate).toISOString().split('T')[0]
          : '',
        salary: initialData.salary || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        company: '',
        role: '',
        location: '',
        jobType: 'Full-Time',
        status: 'Applied',
        applicationDate: new Date().toISOString().split('T')[0],
        applicationLink: '',
        interviewDate: '',
        salary: '',
        notes: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Company name and Role are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Job Application' : 'Add New Job Application'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Google"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Role / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Job Type</label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Remote / NYC"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Application Date</label>
            <input
              type="date"
              value={formData.applicationDate}
              onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Interview Date (optional)</label>
            <input
              type="date"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Salary / Compensation</label>
            <input
              type="text"
              placeholder="e.g. $140,000 / yr"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Application Link / Job URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.applicationLink}
            onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Notes & Follow-ups</label>
          <textarea
            rows="3"
            placeholder="Key discussion points, recruiter info, referral details..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Update Application' : 'Save Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
