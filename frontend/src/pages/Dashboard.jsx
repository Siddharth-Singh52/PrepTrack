import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {

    const { token, setToken } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = async () => {
        const response = await axios.get(
            "http://localhost:5000/api/notes",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setNotes(response.data.notes);
        setLoading(false);
    };

    useEffect(() => {
        console.log("Dashboard Mounted");
        fetchNotes();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;