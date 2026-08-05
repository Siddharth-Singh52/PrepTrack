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

        try {

            await deleteApplication(id);

            fetchApplications();

        } catch (error) {

            console.log(error);

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

        <div>

            <h1>Placement Tracker</h1>

            <hr />

            <h2>Placement Analytics</h2>

            <p><strong>Total Applications:</strong> {analytics.total}</p>

            <p><strong>Offers:</strong> {analytics.offer}</p>

            <p><strong>Interviews:</strong> {analytics.interview}</p>

            <p><strong>Online Assessments:</strong> {analytics.oa}</p>

            <p><strong>Rejected:</strong> {analytics.rejected}</p>

            <p><strong>Priority Companies:</strong> {analytics.priority}</p>

            <p><strong>Upcoming Deadlines:</strong> {analytics.upcoming}</p>

            <p><strong>Success Rate:</strong> {analytics.successRate}%</p>

            <hr />

            <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />

            <br /><br />

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

            <br /><br />

            <h4>Application Date</h4>

            <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
            />

            <br /><br />

            <h4>Deadline</h4>

            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />

            <br /><br />

            <label>

                <input
                    type="checkbox"
                    checked={priority}
                    onChange={(e) => setPriority(e.target.checked)}
                />

                {" "}Priority Company

            </label>

            <br /><br />

            
            <button onClick={ editingId ? handleUpdateApplication : handleAddApplication }>
                {editingId ? "Update Application" : "Add Application"}
            </button>

            <hr />

            <h3>Filter Applications</h3>

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="All">All</option>
                <option value="Applied">Applied</option>
                <option value="OA">OA</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>

            <br /><br />

            {filteredApplications.map((application) => (

                <div
                    key={application._id}
                    style={{
                        border: "1px solid white",
                        padding: "15px",
                        marginBottom: "15px",
                    }}
                >

                    <h3>
                        {application.priority ? "⭐ " : ""}
                        {application.company}
                    </h3>

                    <p>
                        <strong>Role:</strong> {application.role}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}

                        <span
                            style={{
                                color: getStatusColor(application.status),
                                fontWeight: "bold",
                            }}
                        >
                            {
                                application.status === "Applied"
                                    ? "🟡 Applied"
                                    : application.status === "OA"
                                    ? "🔵 OA"
                                    : application.status === "Interview"
                                    ? "🟣 Interview"
                                    : application.status === "Offer"
                                    ? "🟢 Offer"
                                    : "🔴 Rejected"
                            }
                        </span>

                    </p>

                    <p>
                        <strong>Applied:</strong>{" "}
                        {
                            application.applicationDate
                                ? new Date(application.applicationDate).toLocaleDateString()
                                : "--"
                        }
                    </p>

                    <p>
                        <strong>Deadline:</strong>{" "}
                        {
                            application.deadline
                                ? new Date(application.deadline).toLocaleDateString()
                                : "--"
                        }
                    </p>

                    <p>
                        <strong>Time Left:</strong>{" "}
                        {getDeadlineStatus(application.deadline)}
                    </p>

                    <button onClick={() => handleEdit(application)} >
                        Edit
                    </button>

                    {" "}

                    <button onClick={() => handleDelete(application._id)}>
                        Delete
                    </button>

                    <hr />

                    <button
                        onClick={() => {

                            if (expandedApplication === application._id) {
                                setExpandedApplication(null);
                            } 
                            else {
                                setExpandedApplication(application._id);
                                fetchTimeline(application._id);
                                fetchExperiences(application._id);
                            }
                        }}
                    >
                        {
                            expandedApplication === application._id
                                ? "Hide Timeline ▲"
                                : "View Timeline ▼"
                        }
                    </button>

                    {
                        expandedApplication === application._id && (
                            <>
                                <hr />

                                <h4>Interview Timeline</h4>

                                <input
                                    type="text"
                                    placeholder="Event Title"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />

                                <br /><br />

                                <textarea
                                    placeholder="Description"
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                />

                                <br /><br />

                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />

                                <br /><br />

                                <button
                                    onClick={() => handleTimeline(application._id)}
                                >
                                    {editingTimelineId ? "Update Event" : "Add Event"}
                                </button>

                                <hr />

                                {timeline[application._id]?.map((event) => (
                                    <div
                                        key={event._id}
                                        style={{
                                            borderLeft: "3px solid cyan",
                                            marginLeft: "10px",
                                            paddingLeft: "15px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <h4>{event.title}</h4>

                                        <p>{event.description}</p>

                                        <p>
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </p>

                                        <button
                                            onClick={() => {
                                                setEventTitle(event.title);
                                                setEventDescription(event.description);
                                                setEventDate(
                                                    event.eventDate.substring(0, 10)
                                                );
                                                setEditingTimelineId(event._id);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={async () => {
                                                await deleteTimelineEvent(event._id);
                                                fetchTimeline(application._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}

                                <hr />

                                <h4>Interview Experiences</h4>

                                <input
                                    type="text"
                                    placeholder="Interview Round"
                                    value={round}
                                    onChange={(e) => setRound(e.target.value)}
                                />

                                <br /><br />

                                <textarea
                                    placeholder="Questions Asked"
                                    value={questionsAsked}
                                    onChange={(e) => setQuestionsAsked(e.target.value)}
                                />

                                <br /><br />

                                <textarea
                                    placeholder="Notes"
                                    value={experienceNotes}
                                    onChange={(e) => setExperienceNotes(e.target.value)}
                                />

                                <br /><br />

                                <button
                                    onClick={() => handleExperience(application._id)}
                                >
                                    {
                                        editingExperienceId
                                            ? "Update Experience"
                                            : "Add Experience"
                                    }
                                </button>

                                <hr />

                                {experiences[application._id]?.map((experience) => (

                                    <div
                                        key={experience._id}
                                        style={{
                                            border: "1px solid white",
                                            padding: "10px",
                                            marginBottom: "10px",
                                        }}
                                    >

                                        <h4>{experience.round}</h4>

                                        <p>
                                            <strong>Questions Asked:</strong>
                                        </p>

                                        <p>{experience.questionsAsked}</p>

                                        <p>
                                            <strong>Notes:</strong>
                                        </p>

                                        <p>{experience.notes}</p>

                                        <button
                                            onClick={() => {

                                                setRound(experience.round);

                                                setQuestionsAsked(experience.questionsAsked);

                                                setExperienceNotes(experience.notes);

                                                setEditingExperienceId(experience._id);

                                            }}
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={async () => {

                                                await deleteExperience(experience._id);

                                                fetchExperiences(application._id);

                                            }}
                                        >
                                            Delete
                                        </button>

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