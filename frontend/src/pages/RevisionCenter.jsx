import { useEffect, useState } from "react";
import { getUserProgress } from "../services/progressServices";

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

        <div>

            <h1>Revision Center</h1>

            <p>Total Revision Records : {questions.length}</p>

            {questions.map((item) => (

                <div
                    key={item._id}
                    style={{
                        border:"1px solid white",
                        marginBottom:"15px",
                        padding:"15px"
                    }}
                >

                    <h2>{item.question.title}</h2>

                    <p>
                        <strong>Status:</strong> {item.status}
                    </p>

                    <p>
                        <strong>Revision Stage:</strong> {item.revisionStage}
                    </p>

                    <p>
                        <strong>Next Revision:</strong>{" "}
                        {
                            item.nextRevisionDate
                            ? new Date(item.nextRevisionDate).toLocaleDateString()
                            : "--"
                        }
                    </p>

                    <a href={item.question.link} target="_blank" rel="noreferrer" >
                        Solve on LeetCode
                    </a>

                    <br /><br />

                </div>

            ))}

        </div>

    );

}

export default RevisionCenter;