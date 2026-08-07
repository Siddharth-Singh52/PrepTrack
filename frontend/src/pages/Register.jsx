import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";


function Register() {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
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

        if (!formData.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.password.trim()) {
            setError("Please enter your password.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/register", formData);

            setFormData({
                name:"",
                email:"",
                password:""
            });

            navigate("/login");

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="register-page">

            <div className="register-card">

                <h1>Create Account 🚀</h1>

                <p>
                    Register to start tracking your interview preparation.
                </p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

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
                        className="register-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="login-link">

                    Already have an account?{" "}

                    <span onClick={() => navigate("/login")}>
                        Login
                    </span>

                </p>

            </div>

        </div>

    );

}

export default Register;