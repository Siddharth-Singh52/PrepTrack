import "./statCard.css";

const StatCard = ({ title, value, color }) => {

    return (

        <div className="stat-card">

            <h3>{title}</h3>

            <h1
                style={{
                    color: color,
                }}
            >
                {value}
            </h1>

        </div>

    );

};

export default StatCard;