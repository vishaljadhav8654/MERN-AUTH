import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import SuccessModal from "../components/SuccessModal"; 
function Register() {  
    const navigate = useNavigate();  
    const [form, setForm] = useState({    
        name: "",    
        mobile: "",    
        email: "",    
        password: "",    
        confirmPassword: "",  
    });  
    const [error, setError] = useState("");  
    const [showSuccess, setShowSuccess] = useState(false);  
    const handleChange = (e) => {    
        setForm({      ...form,      
            [e.target.name]: e.target.value,    
        });  
    };  
    const handleSubmit = async (e) => {    
        e.preventDefault();    
        setError("");    
        const {      
            name,      
            mobile,      
            email,      
            password,      
            confirmPassword,    
        } = form;    
        if (!name || !mobile || !email || !password || !confirmPassword) {      
            setError("All fields are required");      
            return;    
        }    
        if (!/^[0-9]{10}$/.test(mobile)) {      
            setError("Mobile must contain exactly 10 digits");      
            return;    
        }    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {      
            setError("Please enter a valid email");      
            return;    
        }    
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {      
            setError(        
                "Password needs 8+ chars, uppercase, lowercase and number"      
            );      
            return;    
        }    
        if (password !== confirmPassword) {      
            setError("Passwords do not match");      
            return;    
        }    
        try {      
            const response = await fetch(        
                "http://localhost:5000/api/auth/register",        
                {          
                    method: "POST",          
                    headers: {            
                        "Content-Type": "application/json",          
                    },          
                    body: JSON.stringify({            
                        name,            
                        mobile,            
                        email,            
                        password,          
                    }),        
                }      
            ); 
            const data = await response.json();      
            if (!response.ok) {        
                setError(data.message);        
                return;      
            }      
            setShowSuccess(true);    
        } 
        catch (error) {      
            setError("Cannot connect to server");    
        }  
    };  
    return (    
    <main className="page">      
    <div className="auth-card">        
        <h1>Create Account</h1>        
        <form onSubmit={handleSubmit}>          
            <input            
            type="text"            
            name="name"            
            placeholder="Full name"            
            value={form.name}            
            onChange={handleChange}          
            />          
            <input            
            type="text"            
            name="mobile"            
            placeholder="Mobile number"            
            value={form.mobile}            
            onChange={handleChange}          
            />          
            <input            
            type="email"            
            name="email"            
            placeholder="Email"            
            value={form.email}            
            onChange={handleChange}          
            />          
            <input            
            type="password"            
            name="password"            
            placeholder="Password"            
            value={form.password}            
            onChange={handleChange}          
            />          
            <input            
            type="password"            
            name="confirmPassword"            
            placeholder="Confirm password"            
            value={form.confirmPassword}            
            onChange={handleChange}          
            />          
            {error && <p className="error">{error}</p>}          
            <button type="submit">Register</button>        
            </form>        
            <p className="switch-text">          
                Already have an account?{" "}          
                <Link to="/login">Login</Link>        
                </p>      
                </div>      
                {showSuccess && (        
                    <SuccessModal          
                    title="Registration Successful"          
                    message="Your account has been created successfully."          
                    onOk={() => navigate("/")}        
                    />      
                )}    
                </main>  
                ); 
            } 
            export default Register;