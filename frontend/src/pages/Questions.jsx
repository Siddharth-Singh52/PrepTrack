import { useEffect, useState } from "react";
import { getAllQuestions } from "../services/questionServices";
import { updateProgress, getUserProgress, updateNotes, toggleFavorite, } from "../services/progressServices";
import { useNavigate } from "react-router-dom";
import "../styles/questions.css";

function Questions() {

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("");

    const [questions, setQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState([]);
    const [notes, setNotes] = useState({});

    const navigate = useNavigate();

    const uniqueTopics = [...new Set(allQuestions.map((question) => question.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const uniquePlatforms = [...new Set(allQuestions.map((question) => question.platform).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    useEffect(() => {

        /* Fetching questions and user progress when the component mounts or when filters change */
        const fetchQuestions = async () => {
            try {
                const allData = await getAllQuestions("", "", "", "");
                setAllQuestions(allData.questions || []);

                const data = await getAllQuestions(search, difficulty, topic, platform);
                setQuestions(data.questions || []);
            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                setLoading(false);
            }

            try {
                const progressData = await getUserProgress();
                const validProgress = (progressData.progress || []).filter(
                    (item) => item?.question?._id
                );

                setProgress(validProgress);

                const notesObject = {};

                validProgress.forEach((item) => {
                    notesObject[item.question._id] = item.notes || "";
                });

                setNotes(notesObject);
            } catch (error) {
                console.log(error);
                setProgress([]);
                setNotes({});
            }
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
        const userProgress = progress.find(
            (item) => item?.question?._id === questionId
        );

        return userProgress ? userProgress.status : "Not Started";
    };
    
    /* Function to get the progress object for a specific question and user */
    const getQuestionProgress = (questionId) => {
        return progress.find(
            (item) => item?.question?._id === questionId
        );
    };

    /* Function to check if a question is marked as favorite by the user */
    const isFavorite = (questionId) => {
        const userProgress = progress.find(
            (item) => item?.question?._id === questionId
        );

        return userProgress ? userProgress.favorite : false;
    };

    /* Function to handle saving notes for a specific question and update the backend */
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

    /* Function to handle toggling favorite status for a specific question and update the backend */
    const handleFavorite = async (questionId) => {

        try {
            await toggleFavorite(questionId);
            const progressData = await getUserProgress();
            setProgress(progressData.progress);
        } 
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="question-page">

            <div className="question-header">
                <h1>Question Bank</h1>
                <p>Track, practice and manage your DSA preparation.</p>
            </div>

            <div className="search-section">

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search Questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="filter-grid">

                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    >
                        <option value="">All Topics</option>
                        {uniqueTopics.map((topicOption) => (
                            <option key={topicOption} value={topicOption}>
                                {topicOption}
                            </option>
                        ))}
                    </select>

                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                    >
                        <option value="">All Platforms</option>
                        {uniquePlatforms.map((platformOption) => (
                            <option key={platformOption} value={platformOption}>
                                {platformOption}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <p className="total-questions">
                Total Questions : {questions.length}
            </p>

            <div className="questions-grid">

                {questions.map((question) => {

                    const userProgress = getQuestionProgress(question._id);

                    return (

                        <div
                            key={question._id}
                            className="question-card"
                        >

                            <div className="question-top">

                                <div>

                                    <h2 className="question-title">
                                        {question.title}
                                    </h2>

                                    <div className="question-meta">

                                        <span className="meta-badge">
                                            {question.topic}
                                        </span>

                                        <span className="meta-badge">
                                            {question.difficulty}
                                        </span>

                                        <span className="meta-badge">
                                            {question.platform}
                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="favorite-btn"
                                    onClick={() => handleFavorite(question._id)}
                                >
                                    {isFavorite(question._id)
                                        ? "⭐ Favorite"
                                        : "☆ Favorite"}
                                </button>

                            </div>

                            <div className="question-info">

                                <div className="info-box">

                                    <span className="info-label">
                                        Status
                                    </span>

                                    <span className="info-value">
                                        {getQuestionStatus(question._id)}
                                    </span>

                                </div>

                                <div className="info-box">

                                    <span className="info-label">
                                        Revision Stage
                                    </span>

                                    <span className="info-value">
                                        {userProgress?.revisionStage || 0}
                                    </span>

                                </div>

                                <div className="info-box">

                                    <span className="info-label">
                                        Next Revision
                                    </span>

                                    <span className="info-value">

                                        {
                                            userProgress?.nextRevisionDate
                                                ? new Date(
                                                    userProgress.nextRevisionDate
                                                ).toLocaleDateString()
                                                : "--"
                                        }

                                    </span>

                                </div>

                            </div>

                            <div className="notes-box">

                                <h3>My Notes</h3>

                                <textarea

                                    placeholder="Write your notes..."

                                    value={notes[question._id] || ""}

                                    onChange={(e) =>
                                        setNotes({
                                            ...notes,
                                            [question._id]: e.target.value,
                                        })
                                    }

                                />

                            </div>

                            <div className="card-buttons">

                                <div className="action-buttons">

                                    <button
                                        className="primary-btn"
                                        onClick={() => handleSaveNotes(question._id)}
                                    >
                                        Save Notes
                                    </button>

                                    <button
                                        className="secondary-btn"
                                        onClick={() => window.open(question.link, "_blank")}
                                    >
                                        Solve Question
                                    </button>

                                    <button
                                        className="secondary-btn"
                                        onClick={() => navigate(`/questions/${question._id}`)}
                                    >
                                        Details
                                    </button>

                                </div>

                                <div className="status-buttons">

                                    <button
                                        className="secondary-btn"
                                        onClick={() => handleStatusChange(question._id,"Not Started")}
                                    >
                                        Not Started
                                    </button>

                                    <button
                                        className="warning-btn"
                                        onClick={() => handleStatusChange(question._id,"In Progress")}
                                    >
                                        In Progress
                                    </button>

                                    <button
                                        className="success-btn"
                                        onClick={() => handleStatusChange(question._id,"Completed")}
                                    >
                                        Completed
                                    </button>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );

}

export default Questions;

