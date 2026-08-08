import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProgress } from "../services/progressServices";
import "../styles/revision.css";

function RevisionCenter() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRevisionQuestions = async () => {
            try {
                const data = await getUserProgress();
                setQuestions(data.progress || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRevisionQuestions();
    }, []);

    if (loading) {
        return (
            <div className="revision-loading">
                <h2>Loading Revision Center...</h2>
                <p>Preparing your scheduled revisions.</p>
            </div>
        );
    }

    return (
        <div className="revision-page">

            {/* HEADER */}
            <div className="revision-header">
                <h1>Revision Center</h1>

                <p>
                    Review your scheduled DSA revisions.
                </p>
            </div>

            {/* TOTAL */}
            <p className="revision-total">
                Total Revision Records: {questions.length}
            </p>

            {/* EMPTY STATE */}
            {questions.length === 0 ? (
                <div className="revision-empty">

                    <h2>No revision records yet</h2>

                    <p>
                        Complete a question from the Question Bank
                        to start your revision schedule.
                    </p>

                    <button
                        className="revision-primary-btn"
                        onClick={() => navigate("/questions")}
                    >
                        Go to Question Bank
                    </button>

                </div>
            ) : (

                /* REVISION GRID */
                <div className="revision-grid">

                    {questions.map((item) => {

                        const question = item.question;

                        return (
                            <div
                                key={item._id}
                                className="revision-card"
                            >

                                {/* TITLE */}
                                <div className="revision-title-section">

                                    <h2>
                                        {question?.title || "Question"}
                                    </h2>

                                    <button
                                        className="revision-review-btn"
                                        onClick={() =>
                                            navigate(
                                                `/questions/${question?._id}`
                                            )
                                        }
                                    >
                                        Review Question
                                    </button>

                                </div>

                                {/* DIVIDER */}
                                <div className="revision-divider"></div>

                                {/* INFORMATION */}
                                <div className="revision-details">

                                    <div className="revision-detail">
                                        <span className="revision-detail-label">
                                            STATUS
                                        </span>

                                        <span className="revision-detail-value">
                                            {item.status || "Not Started"}
                                        </span>
                                    </div>

                                    <div className="revision-detail">
                                        <span className="revision-detail-label">
                                            REVISION STAGE
                                        </span>

                                        <span className="revision-detail-value">
                                            {item.revisionStage || 0}
                                        </span>
                                    </div>

                                    <div className="revision-detail">
                                        <span className="revision-detail-label">
                                            NEXT REVISION
                                        </span>

                                        <span className="revision-detail-value">
                                            {item.nextRevisionDate
                                                ? new Date(
                                                    item.nextRevisionDate
                                                ).toLocaleDateString()
                                                : "--"}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default RevisionCenter;