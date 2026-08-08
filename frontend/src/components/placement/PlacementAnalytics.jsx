import StatCard from "../statCard";

function PlacementAnalytics({ analytics }) {

    return (

        <div className="dashboard-grid">

            <StatCard
                title="Applications"
                value={analytics?.placements?.totalApplications || 0}
                color="#60a5fa"
            />

            <StatCard
                title="Offers"
                value={analytics?.placements?.offers || 0}
                color="#facc15"
            />

            <StatCard
                title="Interviews"
                value={analytics?.placements?.interviews || 0}
                color="#a855f7"
            />

            <StatCard
                title="Online Assessments"
                value={analytics?.placements?.oa || 0}
                color="#38bdf8"
            />

            <StatCard
                title="Upcoming Deadlines"
                value={analytics?.placements?.upcomingDeadlines || 0}
                color="#fb923c"
            />

            <StatCard
                title="Success Rate"
                value={`${analytics?.placements?.successRate || 0}%`}
                color="#22c55e"
            />

        </div>

    );

}

export default PlacementAnalytics;