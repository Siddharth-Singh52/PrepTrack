import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/dashboardServices";
import { getDashboardAnalytics, getUpcomingDeadlines, } from "../services/dashboardAnalyticsServices";
import { getTodayRevisions } from "../services/progressServices";
import "../styles/dashboard.css";

import StatCard from "../components/StatCard";

const Dashboard = () => {

    const { token, setToken } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalQuestions: 0, completed: 0, inProgress: 0, notStarted: 0, favorites: 0, completionPercentage: 0, });

    const [analytics, setAnalytics] = useState(null);
    const [todayRevisions, setTodayRevisions] = useState([]);

    const [deadlines, setDeadlines] = useState([]);
    const navigate = useNavigate();

    const fetchDashboard = async () => {

        try {

            const data = await getDashboardStats();

            setStats(data.stats);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const fetchDashboardAnalytics = async () => {

        try {

            const data = await getDashboardAnalytics();

            setAnalytics(data.analytics);

        } catch (error) {

            console.log(error);

        }

    };

    const fetchUpcomingDeadlines = async () => {

        try {

            const data = await getUpcomingDeadlines();

            setDeadlines(data.deadlines);

        } catch (error) {

            console.log(error);

        }

    };

    const fetchTodayRevisions = async () => {

        try {

            const data = await getTodayRevisions();

            setTodayRevisions(data.revisions);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchDashboard();
        fetchDashboardAnalytics();
        fetchTodayRevisions();
        fetchUpcomingDeadlines();

    }, []);

    if (!analytics) {

        return <h2>Loading Dashboard...</h2>;

    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>

                    <h1>Dashboard</h1>

                    <p>
                        Track your interview preparation progress.
                    </p>

                </div>

            </div>

            <div className="dashboard-grid">

                <StatCard
                    title="Questions"
                    value={analytics?.questions?.total || 0}
                    color="#4ade80"
                />

                <StatCard
                    title="Completed"
                    value={analytics?.questions?.completed || 0}
                    color="#22c55e"
                />

                <StatCard
                    title="Applications"
                    value={analytics?.placements?.totalApplications || 0}
                    color="#60a5fa"
                />

                <StatCard
                    title="Interviews"
                    value={analytics?.placements?.interviews || 0}
                    color="#a855f7"
                />

                <StatCard
                    title="Offers"
                    value={analytics?.placements?.offers || 0}
                    color="#facc15"
                />

                <StatCard
                    title="Success Rate"
                    value={`${analytics?.placements?.successRate || 0}%`}
                    color="#fb923c"
                />

            </div>

            <div className="section-divider"></div>

            <h2 className="section-title">Today's Revision</h2>

            {
                todayRevisions.length === 0 ? (

                    <div className="empty-card">
                        🎉 No revisions scheduled for today.
                    </div>

                ) : (

                    todayRevisions.map((item) => (

                        <div
                            key={item._id}
                            className="revision-card"
                        >

                            <h3>{item.question.title}</h3>

                            <p>
                                <strong>Topic:</strong> {item.question.topic}
                            </p>

                            <p>
                                <strong>Revision Stage:</strong> {item.revisionStage}
                            </p>

                            <button className="primary-btn"
                                onClick={() => navigate(`/questions/${item.question._id}`)}
                            >
                                Review Now
                            </button>

                        </div>

                    ))

                )
            }

            <div className="section-divider"></div>

            <h2 className="section-title">Upcoming Deadlines</h2>

            {
                deadlines.length === 0 ? (

                    <div className="empty-card">
                        🕒 No upcoming deadlines.
                    </div>

                ) : (

                    deadlines.map((application) => (

                        <div
                            key={application._id}
                            className="deadline-card"
                        >

                            <h3 className="company-name">{application.company}</h3>

                            <p className="deadline-role">{application.role}</p>

                            <p className="deadline-date">
                                📅 Deadline :
                                {" "}
                                {new Date(application.deadline).toLocaleDateString()}
                            </p>

                        </div>

                    ))

                )
            }

        </div>
    );
};

export default Dashboard;