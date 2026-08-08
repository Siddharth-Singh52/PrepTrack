import { NavLink } from "react-router-dom";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>PrepTrack</h2>
            </div>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/questions">
                    Question Bank
                </NavLink>

                <NavLink to="/revision">
                    Revision Center
                </NavLink>

                <NavLink to="/placements">
                    Placement Tracker
                </NavLink>

            </nav>

        </aside>

    );

}

export default Sidebar;