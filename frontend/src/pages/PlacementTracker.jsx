import { useEffect, useState } from "react";
import { getApplications, createApplication, deleteApplication, updateApplication } from "../services/applicationServices";
import {
    addTimelineEvent,
    getTimeline,
    updateTimelineEvent,
    deleteTimelineEvent,
} from "../services/timelineServices";

import {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} from "../services/interviewExperienceServices";
import PlacementAnalytics from "../components/placement/PlacementAnalytics";

import "../styles/placement.css";

function PlacementTracker() {

    const [applications, setApplications] = useState([]);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");

    const [editingId, setEditingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");

    const [applicationDate, setApplicationDate] = useState("");
    const [deadline, setDeadline] = useState("");

    const [priority, setPriority] = useState(false);

    const [timeline, setTimeline] = useState({});

    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [editingTimelineId, setEditingTimelineId] = useState(null);

    const [experiences, setExperiences] = useState({});
    const [round, setRound] = useState("");
    const [questionsAsked, setQuestionsAsked] = useState("");
    const [experienceNotes, setExperienceNotes] = useState("");
    const [editingExperienceId, setEditingExperienceId] = useState(null);
    
    const [expandedApplication, setExpandedApplication] = useState(null);

    const analytics = {
        total: applications.length,

        applied: applications.filter(
            (app) => app.status === "Applied"
        ).length,

        oa: applications.filter(
            (app) => app.status === "OA"
        ).length,

        interview: applications.filter(
            (app) => app.status === "Interview"
        ).length,

        offer: applications.filter(
            (app) => app.status === "Offer"
        ).length,

        rejected: applications.filter(
            (app) => app.status === "Rejected"
        ).length,

        priority: applications.filter(
            (app) => app.priority
        ).length,

        upcoming: applications.filter((app) => {
            if (!app.deadline) return false;

            const today = new Date();
            const deadline = new Date(app.deadline);

            const diff =
                Math.ceil(
                    (deadline - today) /
                    (1000 * 60 * 60 * 24)
                );

            return diff >= 0 && diff <= 5;
        }).length,
    };

    analytics.successRate =
        analytics.total === 0 ? 0 : Math.round( (analytics.offer / analytics.total) * 100 );

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {

        try {

            const data = await getApplications();
            setApplications(data.applications);

            data.applications.forEach((application) => { fetchTimeline(application._id) });

        } catch (error) {

            console.log(error);

        }

    };

    const fetchTimeline = async (applicationId) => {

        try {

            const data = await getTimeline(applicationId);

            setTimeline((prev) => ({
                ...prev,
                [applicationId]: data.timeline,
            }));

        } catch (error) {

            console.log(error);

        }

    };

    const handleAddApplication = async () => {

        if (!company.trim()) {
            alert("Please enter company name.");
            return;
        }

        if (!role.trim()) {
            alert("Please enter role.");
            return;
        }

        if (!applicationDate) {
            alert("Please select application date.");
            return;
        }

        try {

            await createApplication({
                company,
                role,
                status,
                applicationDate,
                deadline,
                priority,
            });

            setCompany("");
            setRole("");
            setStatus("Applied");
            setApplicationDate("");
            setDeadline("");
            setPriority(false);

            fetchApplications();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add application."
            );

        }
    };

    const handleUpdateApplication = async () => {

        try {

            await updateApplication(editingId, {
                company,
                role,
                status,
                applicationDate,
                deadline,
                priority,
            });

            setCompany("");
            setRole("");
            setStatus("Applied");
            setApplicationDate("");
            setDeadline("");
            setEditingId(null);
            setPriority(false);

            fetchApplications();

        } catch (error) {

            console.log(error);

        }

    };

    const handleEdit = (application) => {

        setCompany(application.company);
        setRole(application.role);
        setStatus(application.status);
        setEditingId(application._id);
        setPriority(application.priority);

        setApplicationDate( application.applicationDate ? application.applicationDate.substring(0, 10) : "" );
        setDeadline( application.deadline ? application.deadline.substring(0, 10) : "" );

    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteApplication(id);

            fetchApplications();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete application."
            );

        }
    };

    const filteredApplications = filterStatus === "All" ? applications : applications.filter(
        (application) => application.status === filterStatus
    );

    const getStatusColor = (status) => {

        switch (status) {

            case "Applied":
                return "gold";

            case "OA":
                return "deepskyblue";

            case "Interview":
                return "violet";

            case "Offer":
                return "limegreen";

            case "Rejected":
                return "red";

            default:
                return "white";
        }

    };

    const handleTimeline = async (applicationId) => {

        try {

            if (editingTimelineId) {

                await updateTimelineEvent(
                    editingTimelineId,
                    {
                        title: eventTitle,
                        description: eventDescription,
                        eventDate,
                    }
                );

            } else {

                await addTimelineEvent({

                    application: applicationId,

                    title: eventTitle,

                    description: eventDescription,

                    eventDate,

                });

            }

            setEventTitle("");
            setEventDescription("");
            setEventDate("");
            setEditingTimelineId(null);

            fetchTimeline(applicationId);

        } catch (error) {

            console.log(error);

        }

    };

    const fetchExperiences = async (applicationId) => {

        try {

            const data = await getExperiences(applicationId);
            setExperiences((prev) => ({
                ...prev,
                [applicationId]: data.experiences,
            }));

        } catch (error) {
            console.log(error);
        }

    };

    const handleExperience = async (applicationId) => {

        try {

            if (editingExperienceId) {

                await updateExperience(editingExperienceId, {
                    round,
                    questionsAsked,
                    notes: experienceNotes,
                });

                setEditingExperienceId(null);

            } else {

                await createExperience({
                    application: applicationId,
                    round,
                    questionsAsked,
                    notes: experienceNotes,
                });

            }

            setRound("");
            setQuestionsAsked("");
            setExperienceNotes("");

            fetchExperiences(applicationId);

        } catch (error) {

            console.log(error);

        }

    };

    const getDeadlineStatus = (deadline) => {

        if (!deadline) return "--";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(deadline);
        endDate.setHours(0, 0, 0, 0);

        const difference = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        if (difference < 0) {
            return "⚫ Expired";
        }

        if (difference === 0) {
            return "🔴 Deadline Today";
        }

        if (difference <= 5) {
            return `🟡 ${difference} Day${difference > 1 ? "s" : ""} Left`;
        }

        return `🟢 ${difference} Day${difference > 1 ? "s" : ""} Left`;

    };

    return (

        <div className="placement-page">

            <h1 className="page-title">
                Placement Tracker
            </h1>

            <div className="analytics-grid">

                <div className="analytics-card">
                    <h3>Total Applications</h3>
                    <h2>{analytics.total}</h2>
                </div>

                <div className="analytics-card">
                    <h3>Offers</h3>
                    <h2>{analytics.offer}</h2>
                </div>

                <div className="analytics-card">
                    <h3>Interviews</h3>
                    <h2>{analytics.interview}</h2>
                </div>

                <div className="analytics-card">
                    <h3>Online Assessments</h3>
                    <h2>{analytics.oa}</h2>
                </div>

                <div className="analytics-card">
                    <h3>Upcoming Deadlines</h3>
                    <h2>{analytics.upcoming}</h2>
                </div>

                <div className="analytics-card">
                    <h3>Success Rate</h3>
                    <h2>{analytics.successRate}%</h2>
                </div>

            </div>

            <div className="placement-form">

                <h2>
                    {editingId ? "Update Application" : "Add New Application"}
                </h2>

                <div className="form-grid">

                    <input
                        type="text"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option>Applied</option>
                        <option>OA</option>
                        <option>Interview</option>
                        <option>Rejected</option>
                        <option>Offer</option>
                    </select>

                    <input
                        type="date"
                        value={applicationDate}
                        onChange={(e) => setApplicationDate(e.target.value)}
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />

                    <label className="priority-checkbox">

                        <input
                            type="checkbox"
                            checked={priority}
                            onChange={(e) => setPriority(e.target.checked)}
                        />

                        Priority Company

                    </label>

                </div>

                <button
                    className="primary-btn"
                    onClick={
                        editingId
                            ? handleUpdateApplication
                            : handleAddApplication
                    }
                >
                    {editingId ? "Update Application" : "Add Application"}
                </button>

            </div>

            <div className="filter-section">

                <h2>Filter Applications</h2>

                <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e)=>setFilterStatus(e.target.value)}
                >

                    <option value="All">All</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>

                </select>

            </div>

            {filteredApplications.map((application) => (

                <div
                    key={application._id}
                    className="application-card"
                >

                    <div className="application-header">

                        <div>

                            <h2>
                                {application.priority ? "⭐ " : ""}
                                {application.company}
                            </h2>

                            <p className="application-role">
                                {application.role}
                            </p>

                        </div>

                        <div className="status-badge">
                            {
                                application.status === "Applied"
                                    ? "🟡 Applied"
                                    : application.status === "OA"
                                    ? "🔵 Online Assessment"
                                    : application.status === "Interview"
                                    ? "🟣 Interview"
                                    : application.status === "Offer"
                                    ? "🟢 Offer"
                                    : "🔴 Rejected"
                            }
                        </div>

                </div>

                <div className="application-details">

                    <div className="detail-box">
                        <span className="detail-label">Applied</span>

                        <span className="detail-value">
                            {
                                application.applicationDate
                                    ? new Date(
                                        application.applicationDate
                                    ).toLocaleDateString()
                                    : "--"
                            }
                        </span>
                    </div>

                    <div className="detail-box">
                        <span className="detail-label">Deadline</span>

                        <span className="detail-value">
                            {
                                application.deadline
                                    ? new Date(
                                        application.deadline
                                    ).toLocaleDateString()
                                    : "--"
                            }
                        </span>
                    </div>

                    <div className="detail-box">
                        <span className="detail-label">Time Left</span>

                        <span className="detail-value">
                            {getDeadlineStatus(application.deadline)}
                        </span>
                    </div>

                </div>

                <div className="card-actions">

                    <button
                        className="edit-btn"
                        onClick={() => handleEdit(application)}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(application._id)}
                    >
                        Delete
                    </button>

                    <button
                        className="timeline-btn"
                        onClick={() => {

                            if (expandedApplication === application._id) {

                                setExpandedApplication(null);

                            } else {

                                setExpandedApplication(application._id);

                                fetchTimeline(application._id);

                                fetchExperiences(application._id);

                            }

                        }}
                    >

                        {
                            expandedApplication === application._id
                                ? "Hide Details ▲"
                                : "View Details ▼"
                        }

                    </button>

                </div>

                    {
                        expandedApplication === application._id && (
                            <>
                                <div className="divider"></div>

                                <h3 className="section-heading">
                                    Interview Timeline
                                </h3>

                                <div className="timeline-form">

                                    <input
                                        type="text"
                                        placeholder="Event Title"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                    />

                                    <textarea
                                        placeholder="Description"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                    />

                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                    />

                                    <button
                                        onClick={() => handleTimeline(application._id)}
                                    >
                                        {editingTimelineId ? "Update Event" : "Add Event"}
                                    </button>

                                </div>

                                <div className="divider"></div>

                                {timeline[application._id]?.map((event) => (
                                    <div
                                        key={event._id}
                                        className="timeline-card"
                                    >
                                        <h4>{event.title}</h4>

                                        <p>{event.description}</p>

                                        <p>
                                            📅 {new Date(event.eventDate).toLocaleDateString()}
                                        </p>

                                        <div className="card-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setEventTitle(event.title);
                                                    setEventDescription(event.description);
                                                    setEventDate(event.eventDate.substring(0, 10));
                                                    setEditingTimelineId(event._id);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={async () => {
                                                    await deleteTimelineEvent(event._id);
                                                    fetchTimeline(application._id);
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                ))}

                                <div className="divider"></div>

                                <h3 className="section-heading">
                                    Interview Experiences
                                </h3>

                                <div className="experience-form">

                                    <input
                                        type="text"
                                        placeholder="Interview Round"
                                        value={round}
                                        onChange={(e) => setRound(e.target.value)}
                                    />

                                    <textarea
                                        placeholder="Questions Asked"
                                        value={questionsAsked}
                                        onChange={(e) => setQuestionsAsked(e.target.value)}
                                    />

                                    <textarea
                                        placeholder="Notes"
                                        value={experienceNotes}
                                        onChange={(e) => setExperienceNotes(e.target.value)}
                                    />

                                    <button
                                        onClick={() => handleExperience(application._id)}
                                    >
                                        {
                                            editingExperienceId
                                                ? "Update Experience"
                                                : "Add Experience"
                                        }
                                    </button>

                                </div>

                                <div className="divider"></div>

                                {experiences[application._id]?.map((experience) => (

                                    <div
                                        key={experience._id}
                                        className="experience-card"
                                    >

                                        <h4>{experience.round}</h4>

                                        <p>
                                            <strong>Questions Asked</strong>
                                        </p>

                                        <p>{experience.questionsAsked}</p>

                                        <p>
                                            <strong>Notes</strong>
                                        </p>

                                        <p>{experience.notes}</p>

                                        <div className="card-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setRound(experience.round);
                                                    setQuestionsAsked(experience.questionsAsked);
                                                    setExperienceNotes(experience.notes);
                                                    setEditingExperienceId(experience._id);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={async () => {
                                                    await deleteExperience(experience._id);
                                                    fetchExperiences(application._id);
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </>
                        )
                    }

                </div>

            ))}

        </div>

    );

}

export default PlacementTracker;