import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSingleQuestion } from "../services/questionServices";

import { getUserProgress, updateProgress, updateNotes, toggleFavorite, } from "../services/progressServices";

function QuestionDetails() {

    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    const [progress, setProgress] = useState(null);
    const [notes, setNotes] = useState("");

    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                const data = await getSingleQuestion(id);
                setQuestion(data.question);

                const progressData = await getUserProgress();
                const validProgress = (progressData.progress || []).filter(
                    (item) => item?.question?._id
                );

                const currentProgress = validProgress.find(
                    (item) => item.question._id === id
                );

                if (currentProgress) {
                    setProgress(currentProgress);
                    setNotes(currentProgress.notes || "");
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }

        };

        fetchQuestion();

    }, [id]);

    if(loading){
        return <h2>Loading...</h2>;
    }

    if (!question) {
        return (
            <div>
                <h2>Question not found</h2>
                <p>The requested question could not be loaded.</p>
            </div>
        );
    }

    const handleStatusChange = async (status) => {
        try {
            await updateProgress(id, status);

            const progressData = await getUserProgress();
            const validProgress = (progressData.progress || []).filter(
                (item) => item?.question?._id
            );

            const currentProgress = validProgress.find(
                (item) => item.question._id === id
            );

            setProgress(currentProgress || null);
        } 
        catch (error) {
            console.log(error);
        }
    };

    const handleSaveNotes = async () => {
        try {
            await updateNotes(id, notes);

            const progressData = await getUserProgress();
            const validProgress = (progressData.progress || []).filter(
                (item) => item?.question?._id
            );

            const currentProgress = validProgress.find(
                (item) => item.question._id === id
            );

            setProgress(currentProgress || null);
            setNotes(currentProgress?.notes || "");

            alert("Notes Saved");
        } 
        catch (error) {
            console.log(error);
        }
    };

    const handleFavorite = async () => {
        try {
            await toggleFavorite(id);

            const progressData = await getUserProgress();
            const validProgress = (progressData.progress || []).filter(
                (item) => item?.question?._id
            );

            const currentProgress = validProgress.find(
                (item) => item.question._id === id
            );

            setProgress(currentProgress || null);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div>

            <h1>{question.title}</h1>

            <p>
                <strong>Topic:</strong> {question.topic}
            </p>

            <p>
                <strong>Difficulty:</strong> {question.difficulty}
            </p>

            <p>
                <strong>Platform:</strong> {question.platform}
            </p>

            <button onClick={handleFavorite}>
                {progress?.favorite ? "⭐ Favorite" : "☆ Favorite"}
            </button>

            <p>
                <strong>Status:</strong>{" "}
                {progress ? progress.status : "Not Started"}
            </p>

            <p>
                <strong>Revision Stage:</strong>{" "}
                {progress ? progress.revisionStage : 0}
            </p>

            <p>
                <strong>Next Revision:</strong>{" "}
                {
                    progress?.nextRevisionDate
                        ? new Date(progress.nextRevisionDate).toLocaleDateString()
                        : "--"
                }
            </p>

            <h3>My Notes</h3>

            <textarea
                rows="5"
                cols="60"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSaveNotes}>
                Save Notes
            </button>

            <a
                href={question.link}
                target="_blank"
                rel="noreferrer"
            >
                Solve on LeetCode
            </a>

            <br /><br />

            <button onClick={() => handleStatusChange("Not Started")}>
                Not Started
            </button>

            <button onClick={() => handleStatusChange("In Progress")}>
                In Progress
            </button>

            <button onClick={() => handleStatusChange("Completed")}>
                Completed
            </button>

        </div>

    );

}

export default QuestionDetails;