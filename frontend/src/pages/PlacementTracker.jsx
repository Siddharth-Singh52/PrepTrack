import { useEffect, useState } from "react";

import { getApplications, createApplication, deleteApplication, updateApplication } from "../services/applicationServices";

function PlacementTracker() {

    const [applications, setApplications] = useState([]);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");

    const [editingId, setEditingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");

    const [applicationDate, setApplicationDate] = useState("");
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {

        try {

            const data = await getApplications();
            setApplications(data.applications);

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
            });

            setCompany("");
            setRole("");
            setStatus("Applied");
            setApplicationDate("");
            setDeadline("");

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
            });

            setCompany("");
            setRole("");
            setStatus("Applied");
            setApplicationDate("");
            setDeadline("");
            setEditingId(null);

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

                    <h3>{application.company}</h3>

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

                </div>

            ))}

        </div>

    );

}

export default PlacementTracker;