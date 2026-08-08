import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/dashboardServices";
import { getDashboardAnalytics, getUpcomingDeadlines, } from "../services/dashboardAnalyticsServices";
import { getTodayRevisions } from "../services/progressServices";
import "../styles/dashboard.css";

import StatCard from "../components/statCard";

const Dashboard = () => {

    const { token } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalQuestions: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        favorites: 0,
        completionPercentage: 0,
    });

    const [analytics, setAnalytics] = useState(null);

    const [todayRevisions, setTodayRevisions] = useState([]);

    const [deadlines, setDeadlines] = useState([]);

    const navigate = useNavigate();


    /* =========================
       Fetch Dashboard Stats
    ========================= */

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


    /* =========================
       Fetch Analytics
    ========================= */

    const fetchDashboardAnalytics = async () => {

        try {

            const data = await getDashboardAnalytics();

            setAnalytics(data.analytics);

        } catch (error) {

            console.log(error);

        }

    };


    /* =========================
       Fetch Upcoming Deadlines
    ========================= */

    const fetchUpcomingDeadlines = async () => {

        try {

            const data = await getUpcomingDeadlines();

            setDeadlines(data.deadlines);

        } catch (error) {

            console.log(error);

        }

    };


    /* =========================
       Fetch Today's Revisions
    ========================= */

    const fetchTodayRevisions = async () => {

        try {

            const data = await getTodayRevisions();

            setTodayRevisions(data.revisions);

        } catch (error) {

            console.log(error);

        }

    };


    /* =========================
       Load Dashboard
    ========================= */

    useEffect(() => {

        fetchDashboard();
        fetchDashboardAnalytics();
        fetchTodayRevisions();
        fetchUpcomingDeadlines();

    }, []);


    /* =========================
       Loading
    ========================= */

    if (loading || !analytics) {

        return (
            <div className="dashboard-loading">
                <h2>Loading Dashboard...</h2>
                <p>Preparing your Interview Progress.</p>
            </div>
        );

    }


    /* =========================
       Progress Calculation
    ========================= */

    const totalQuestions =
        analytics?.questions?.total || 0;

    const completedQuestions =
        analytics?.questions?.completed || 0;

    const progressPercentage =
        totalQuestions > 0
            ? Math.round((completedQuestions / totalQuestions) * 100)
            : 0;


    return (

        <div className="dashboard-page">


            {/* =========================
                Header
            ========================= */}

            <div className="dashboard-header">

                <div>

                    <h1>Dashboard</h1>

                    <p>
                        Track your Interview Preparation progress.
                    </p>

                </div>

            </div>


            {/* =========================
                Statistics
            ========================= */}

            <div className="dashboard-grid">

                <StatCard
                    title="Questions"
                    value={totalQuestions}
                    color="#4ade80"
                />

                <StatCard
                    title="Completed"
                    value={completedQuestions}
                    color="#22c55e"
                />

                <StatCard
                    title="Applications"
                    value={
                        analytics?.placements?.totalApplications || 0
                    }
                    color="#60a5fa"
                />

                <StatCard
                    title="Interviews"
                    value={
                        analytics?.placements?.interviews || 0
                    }
                    color="#a855f7"
                />

                <StatCard
                    title="Offers"
                    value={
                        analytics?.placements?.offers || 0
                    }
                    color="#facc15"
                />

                <StatCard
                    title="Success Rate"
                    value={`${analytics?.placements?.successRate || 0}%`}
                    color="#fb923c"
                />

            </div>


            {/* =========================
                DSA Progress
            ========================= */}

            <div className="dashboard-section">

                <div className="section-title-row">

                    <div>

                        <h2>DSA Progress</h2>

                        <p>
                            Keep building your problem-solving skills.
                        </p>

                    </div>

                    <span className="progress-percentage">
                        {progressPercentage}%
                    </span>

                </div>


                <div className="progress-bar-container">

                    <div
                        className="progress-bar"
                        style={{
                            width: `${progressPercentage}%`
                        }}
                    ></div>

                </div>


                <div className="progress-details">

                    <span>
                        {completedQuestions} completed
                    </span>

                    <span>
                        {totalQuestions} total questions
                    </span>

                </div>


                <div className="progress-stats">

                    <div>
                        <span className="progress-number completed-number">
                            {stats.completed || 0}
                        </span>

                        <span>
                            Completed
                        </span>
                    </div>


                    <div>
                        <span className="progress-number progress-number-orange">
                            {stats.inProgress || 0}
                        </span>

                        <span>
                            In Progress
                        </span>
                    </div>


                    <div>
                        <span className="progress-number progress-number-gray">
                            {stats.notStarted || 0}
                        </span>

                        <span>
                            Not Started
                        </span>
                    </div>


                    <div>
                        <span className="progress-number progress-number-purple">
                            {stats.favorites || 0}
                        </span>

                        <span>
                            Favorites
                        </span>
                    </div>

                </div>

            </div>


            {/* =========================
                Quick Actions
            ========================= */}

            <div className="dashboard-section">

                <h2 className="section-heading">
                    Quick Actions
                </h2>

                <div className="quick-actions">

                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/questions")}
                    >

                        <span className="quick-action-icon">
                            💻
                        </span>

                        <div>

                            <h3>
                                Practice Questions
                            </h3>

                            <p>
                                Continue solving DSA problems.
                            </p>

                        </div>

                    </button>


                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/revision")}
                    >

                        <span className="quick-action-icon">
                            🔄
                        </span>

                        <div>

                            <h3>
                                Revision Center
                            </h3>

                            <p>
                                Review your scheduled revisions.
                            </p>

                        </div>

                    </button>


                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/placements")}
                    >

                        <span className="quick-action-icon">
                            💼
                        </span>

                        <div>

                            <h3>
                                Placement Tracker
                            </h3>

                            <p>
                                Track applications and interviews.
                            </p>

                        </div>

                    </button>

                </div>

            </div>


            {/* =========================
                Today's Revision
            ========================= */}

            <div className="dashboard-section">

                <div className="section-title-row">

                    <div>

                        <h2>Today's Revision</h2>

                        <p>
                            Questions that are ready for revision today.
                        </p>

                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() => navigate("/revision")}
                    >
                        View All
                    </button>

                </div>


                {
                    todayRevisions.length === 0 ? (

                        <div className="empty-card">

                            <span className="empty-icon">
                                🎉
                            </span>

                            <h3>
                                You're all caught up!
                            </h3>

                            <p>
                                No revisions are scheduled for today.
                            </p>

                        </div>

                    ) : (

                        <div className="revision-list">

                            {
                                todayRevisions.map((item) => (

                                    <div
                                        key={item._id}
                                        className="revision-card"
                                    >

                                        <div>

                                            <span className="revision-badge">
                                                Stage {item.revisionStage}
                                            </span>

                                            <h3>
                                                {item.question.title}
                                            </h3>

                                            <p>
                                                <strong>Topic:</strong>{" "}
                                                {item.question.topic}
                                            </p>

                                        </div>


                                        <button
                                            className="primary-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/questions/${item.question._id}`
                                                )
                                            }
                                        >
                                            Review Now
                                        </button>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>


            {/* =========================
                Upcoming Deadlines
            ========================= */}

            <div className="dashboard-section">

                <div className="section-title-row">

                    <div>

                        <h2>Upcoming Deadlines</h2>

                        <p>
                            Keep track of your application deadlines.
                        </p>

                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() => navigate("/placements")}
                    >
                        View Tracker
                    </button>

                </div>


                {
                    deadlines.length === 0 ? (

                        <div className="empty-card">

                            <span className="empty-icon">
                                🕒
                            </span>

                            <h3>
                                No upcoming deadlines
                            </h3>

                            <p>
                                Your upcoming application deadlines will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="deadline-list">

                            {
                                deadlines.map((application) => (

                                    <div
                                        key={application._id}
                                        className="deadline-card"
                                    >

                                        <div>

                                            <h3 className="company-name">
                                                {application.company}
                                            </h3>

                                            <p className="deadline-role">
                                                {application.role}
                                            </p>

                                        </div>


                                        <div className="deadline-date">

                                            📅{" "}
                                            {new Date(
                                                application.deadline
                                            ).toLocaleDateString()}

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>

        </div>

    );
};

export default Dashboard;