import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const { token, setToken } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
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

        } 
        catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    const handleAddNote = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/notes",
                {
                    title,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setContent("");

            fetchNotes();

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/notes/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchNotes();

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingId(note._id);
    };

    const handleUpdateNote = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/notes/${editingId}`,
                {
                    title,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setContent("");
            setEditingId(null);

            fetchNotes();

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    useEffect(() => {
        console.log("Dashboard Mounted");
        fetchNotes();
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

            <button onClick={() => navigate("/questions")}>
                Question Bank
            </button>

            <hr />

            <div>
                <h2>Add New Note</h2>

                <input
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br /><br />

                <textarea
                    placeholder="Enter Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <br /><br />

                <button onClick={editingId ? handleUpdateNote : handleAddNote}>
                    {editingId ? "Update Note" : "Add Note"}
                </button>
            </div>

            <hr />

            {/* 👇 Existing notes list starts here */}

            {notes.length === 0 ? (
                <h2>No Notes Found</h2>
            ) : (
                notes.map((note) => (
                    <div
                        key={note._id}
                        style={{
                            border: "1px solid black",
                            margin: "10px",
                            padding: "10px",
                        }}
                    >
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>

                        <button onClick={() => handleEdit(note)}>
                            Edit
                        </button>

                        <button onClick={() => handleDeleteNote(note._id)}>
                            Delete
                        </button>
                    </div>
                ))
            )}

        </div>
    );
};

export default Dashboard;