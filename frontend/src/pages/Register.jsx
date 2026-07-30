import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


function Register() {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
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
            const response = await api.post("/auth/register", formData);
            alert("Registration successful! Please login.");

            setFormData({
                name: "",
                email: "",
                password: ""
            });
            
            navigate("/login");
        }
        catch(error){
            console.log(error);
        }
    };

    return (

        <div>

            <h1>Register</h1>

            <form onSubmit = {handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <br /><br />

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

                    Register

                </button>

            </form>

        </div>

    );

}

export default Register;