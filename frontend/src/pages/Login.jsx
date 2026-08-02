import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try{
            const response = await api.post("/auth/login", formData);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
            
            
            setFormData({
                email: "",
                password: ""
            });
            
            navigate("/dashboard");
        }
        catch(error){
            console.log(error.response.data.message);
        }
    };

    return (

        <div>
            <h1>Login</h1>
            <form onSubmit = {handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>

    );

}

export default Login;