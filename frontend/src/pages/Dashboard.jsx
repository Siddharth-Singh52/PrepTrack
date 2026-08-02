import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/dashboardServices";

const Dashboard = () => {

    const { token, setToken } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalQuestions: 0, completed: 0, inProgress: 0, notStarted: 0, favorites: 0, completionPercentage: 0, });

    const navigate = useNavigate();

    useEffect(() => {

    const fetchDashboard = async () => {

            try {
                const data = await getDashboardStats();
                setStats(data.stats);
            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>

            <h1>Dashboard</h1>

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            <h2>Dashboard Statistics</h2>

            <p><strong>Total Questions:</strong> {stats.totalQuestions}</p>
            <p><strong>Completed:</strong> {stats.completed}</p>
            <p><strong>In Progress:</strong> {stats.inProgress}</p>
            <p><strong>Not Started:</strong> {stats.notStarted}</p>
            <p><strong>Favorites:</strong> {stats.favorites}</p>
            <p> <strong>Completion:</strong> {stats.completionPercentage}% </p>

            <br />

            <button onClick={() => navigate("/questions")}>
                Open Question Bank
            </button>

        </div>
    );
};

export default Dashboard;