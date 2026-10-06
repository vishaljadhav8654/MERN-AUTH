import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import SuccessModal from "../components/SuccessModal"; 
function Login() {  
    const navigate = useNavigate();  
    const [form, setForm] = useState({    
        identifier: "",    password: "",  
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
                if (!form.identifier || !form.password) {      
                    setError("Please fill in all fields");      
                    return;    
                    }    
                    try {      
                        const response = await fetch(        
                            "http://localhost:5000/api/auth/login",        
                            {          
                                method: "POST",          
                                headers: {            
                                    "Content-Type": "application/json",          
                                    },         
                                    body: JSON.stringify(form),        
                                    }      
                                    );      
                                    const data = await response.json();      
                                    if (!response.ok) {        
                                        setError(data.message);        
                                        return;      
                                        }      
                                        localStorage.setItem("token", data.token);      
                                        localStorage.setItem("user", JSON.stringify(data.user));      
                                        setShowSuccess(true);    
                                        } 
                                        catch (error) {      
                                            setError("Cannot connect to server");    
                                            }  
                                            };  
                                            return (    
                                            <main className="page">      
                                            <div className="auth-card">        
                                                <h1>Login</h1>        
                                                <form onSubmit={handleSubmit}>          
                                                    <input            
                                                    type="text"            
                                                    name="identifier"           
                                                    placeholder="Email or mobile"            
                                                    value={form.identifier}            
                                                    onChange={handleChange}          
                                                    />          
                                                    <input            
                                                    type="password"            
                                                    name="password"            
                                                    placeholder="Password"            
                                                    value={form.password}            
                                                    onChange={handleChange}         
                                                    />{error && <p className="error">{error}</p>}          
                                                    <button type="submit">Login</button>        
                                                    </form>        
                                                    <p className="switch-text">          
                                                        I don't have an account?{" "}          
                                                        <Link to="/register">Register</Link>        
                                                        </p>      
                                                        </div>      
                                                        {showSuccess && (        
                                                            <SuccessModal          
                                                            title="Login Successful"          
                                                            message="You have logged in successfully."          
                                                            onOk={() => navigate("/profile")}        
                                                            />      
                                                        )}    
                                                        </main>  
                                                        ); 
                                                    } 
                                                    export default Login;
