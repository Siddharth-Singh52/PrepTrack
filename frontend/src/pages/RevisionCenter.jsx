import { useEffect, useState } from "react";
import { getUserProgress } from "../services/progressServices";
import "../styles/revision.css";

function RevisionCenter() {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRevisionQuestions = async () => {

            try {

                const data = await getUserProgress();
                setQuestions(data.progress);

            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }

        };

        fetchRevisionQuestions();

    }, []);

    if(loading){
        return <h2>Loading...</h2>;
    }

    return (
        <div className="revision-page">

            <div className="revision-header">
                <h1>Revision Center</h1>
                <p>Review your scheduled DSA revisions.</p>
            </div>

            <p className="total-questions">
                Total Revision Records : {questions.length}
            </p>

            <div className="revision-grid">

                {questions.map((item) => (

                    <div
                        key={item._id}
                        className="revision-card"
                    >

                        <h2>{item.question.title}</h2>

                        <div className="revision-info">

                            <div className="revision-box">
                                <span className="revision-label">Status</span>
                                <span className="revision-value">
                                    {item.status}
                                </span>
                            </div>

                            <div className="revision-box">
                                <span className="revision-label">
                                    Revision Stage
                                </span>

                                <span className="revision-value">
                                    {item.revisionStage}
                                </span>
                            </div>

                            <div className="revision-box">
                                <span className="revision-label">
                                    Next Revision
                                </span>

                                <span className="revision-value">
                                    {item.nextRevisionDate
                                        ? new Date(
                                            item.nextRevisionDate
                                        ).toLocaleDateString()
                                        : "--"}
                                </span>
                            </div>

                        </div>

                        <a
                            href={item.question.link}
                            target="_blank"
                            rel="noreferrer"
                            className="solve-btn"
                        >
                            Solve on LeetCode
                        </a>

                    </div>

                ))}

            </div>

        </div>
    );

}

export default RevisionCenter;