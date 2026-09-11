import Placement from '../models/Placement.js';

export const getPlacements = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, search, jobType, sort } = req.query;

    const allUserPlacements = await Placement.find({ user: userId }).sort({ createdAt: -1 }).lean();
    let placements = [...allUserPlacements];

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      placements = placements.filter(
        (p) =>
          p.company.toLowerCase().includes(s) ||
          p.role.toLowerCase().includes(s) ||
          (p.location && p.location.toLowerCase().includes(s))
      );
    }

    if (status && status !== 'All') {
      placements = placements.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    if (jobType && jobType !== 'All') {
      placements = placements.filter((p) => p.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (sort === 'company') {
      placements.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sort === 'interviewDate') {
      placements.sort((a, b) => {
        if (!a.interviewDate) return 1;
        if (!b.interviewDate) return -1;
        return new Date(a.interviewDate) - new Date(b.interviewDate);
      });
    } else {
      // Default: applicationDate newest first
      placements.sort((a, b) => new Date(b.applicationDate || b.createdAt) - new Date(a.applicationDate || a.createdAt));
    }

    const total = allUserPlacements.length;
    const active = allUserPlacements.filter((p) => !['Rejected', 'Withdrawn', 'Offer'].includes(p.status)).length;
    const interviews = allUserPlacements.filter((p) =>
      ['Interview Scheduled', 'Technical Interview', 'HR Interview'].includes(p.status)
    ).length;
    const offers = allUserPlacements.filter((p) => p.status === 'Offer').length;
    const rejections = allUserPlacements.filter((p) => p.status === 'Rejected').length;
    const resolved = offers + rejections;
    const successRate = resolved > 0 ? Math.round((offers / resolved) * 100) : (offers > 0 ? 100 : 0);

    res.status(200).json({
      success: true,
      analytics: {
        total,
        active,
        interviews,
        offers,
        rejections,
        successRate,
      },
      placements,
    });
  } catch (error) {
    next(error);
  }
};

export const createPlacement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { company, role, location, jobType, applicationDate, applicationLink, status, interviewDate, notes, salary } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company name and Role are required.',
      });
    }

    const newPlacement = await Placement.create({
      user: userId,
      company: company.trim(),
      role: role.trim(),
      location: location || '',
      jobType: jobType || 'Full-Time',
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      applicationLink: applicationLink || '',
      status: status || 'Applied',
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      notes: notes || '',
      salary: salary || '',
    });

    res.status(201).json({
      success: true,
      message: 'Job application added successfully.',
      placement: newPlacement,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlacement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const updated = await Placement.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application updated successfully.',
      placement: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlacement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await Placement.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
