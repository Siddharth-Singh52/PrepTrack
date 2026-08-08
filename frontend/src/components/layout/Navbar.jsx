import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        navigate("/login");

    };

    return (

        <header className="navbar">

            <div>

                <h2>Welcome Back 👋</h2>
                <p>Track your Interview Preparation progress.</p>

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>

        </header>

    );

}

export default Navbar;