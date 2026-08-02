import { useEffect, useState } from "react";
import { getAllQuestions } from "../services/questionServices";
import { updateProgress, getUserProgress, updateNotes, } from "../services/progressServices";

function Questions() {

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("");

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState([]);
    const [notes, setNotes] = useState({});

    useEffect(() => {

        /* Fetching questions and user progress when the component mounts or when filters change */
        const fetchQuestions = async () => {
            try {
                const data = await getAllQuestions( search, difficulty, topic, platform );
                setQuestions(data.questions);
            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                setLoading(false);
            }

            const progressData = await getUserProgress();
            setProgress(progressData.progress);

            const notesObject = {};

            progressData.progress.forEach((item) => {
                notesObject[item.question] = item.notes || "";
            });

            setNotes(notesObject);
        };

        fetchQuestions();

    }, [search, difficulty, topic, platform]);

    /* Function to handle status change for a question and update the progress in the backend */
    const handleStatusChange = async (questionId, status) => {

        try {
            await updateProgress(questionId, status);
            const data = await getAllQuestions(
                search,
                difficulty,
                topic,
                platform
            );

            setQuestions(data.questions);

            const progressData = await getUserProgress();
            setProgress(progressData.progress);
        }
        catch (error) {
            console.log(error);
        }
    };

    /* Function to get the status of a question for the current user */
    const getQuestionStatus = (questionId) => {

        const userProgress = progress.find( (item) => item.question.toString() === questionId );
        return userProgress ? userProgress.status : "Not Started";

    };

    const handleSaveNotes = async (questionId) => {

        try {
            await updateNotes(questionId, notes[questionId]);

            const progressData = await getUserProgress();
            setProgress(progressData.progress);

            alert("Notes Saved!");
        } 
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Question Bank</h1>

            {/* Search input for filtering questions by title */}
            <input
                type="text"
                placeholder="Search Questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <br /><br />

            {/* Dropdowns for filtering questions by difficulty, topic, and platform */}
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>

            <select value={topic} onChange={(e) => setTopic(e.target.value)} >
                <option value="">All Topics</option>
                <option value="Array">Array</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Intervals">Intervals</option>
                <option value="Graph">Graph</option>
            </select>

            <select value={platform} onChange={(e) => setPlatform(e.target.value)} >
                <option value="">All Platforms</option>
                <option value="LeetCode">LeetCode</option>
            </select>

            <p>Total Questions: {questions.length}</p>

            {questions.map((question) => (

                <div
                    key={question._id}
                    style={{
                        border: "1px solid white",
                        padding: "15px",
                        marginBottom: "15px",
                    }}
                >

                    <h2>{question.title}</h2>

                    {/* Displaying question details */}
                    <p> <strong>Topic:</strong> {question.topic} </p>
                    <p> <strong>Difficulty:</strong> {question.difficulty} </p>
                    <p> <strong>Platform:</strong> {question.platform} </p>

                    <p> <strong>Status:</strong> {getQuestionStatus(question._id)}</p>

                    <h4>My Notes</h4>
                    <textarea
                        rows="4"
                        cols="50"
                        placeholder="Write your notes here..."
                        value={notes[question._id] || ""}
                        onChange={(e) =>
                            setNotes({
                                ...notes,
                                [question._id]: e.target.value,
                            })
                        }
                    />

                    <br /><br />

                    <button onClick={() => handleSaveNotes(question._id)} >
                        Save Notes
                    </button>

                    <br /><br />

                    <a href={question.link} target="_blank" rel="noreferrer" >
                        Solve Question
                    </a>

                    <br /><br />

                    {/* Buttons to update the status of the question */}
                    <button onClick={() => handleStatusChange(question._id, "Not Started") } >
                        Not Started
                    </button>

                    <button onClick={() => handleStatusChange(question._id, "In Progress") } >
                        In Progress
                    </button>

                    <button onClick={() => handleStatusChange(question._id, "Completed") } >
                        Completed
                    </button>

                </div>
            ))}
        </div>
    );
}

export default Questions;