import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";
import { Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.password.trim()) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post("/auth/login", formData);

            localStorage.setItem("token", response.data.token);

            setToken(response.data.token);

            setFormData({
                email: "",
                password: ""
            });

            navigate("/dashboard");

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Welcome Back 👋</h1>

                <p className="login-subtitle">
                    Login to continue your interview preparation.
                </p>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {
                        error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )
                    }

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="login-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;