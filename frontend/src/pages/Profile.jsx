import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css' ;
function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                // No token
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                console.log("Profile response:", data);

                // Backend error
                if (!response.ok) {

                    setError(
                        data.message || "Failed to fetch profile"
                    );

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    return;
                }

                // Successfully received profile
                setProfile(data.user);

            } catch (error) {

                console.error("Profile error:", error);

                setError("Cannot connect to the server");

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);


    // Loading
    if (loading) {
        return (
            <div className="page">
                <div className="profile-card">
                    <h2>Loading Profile.....</h2>
                </div>
            </div>
        );
    }


    // Error
    if (error) {
        return (
            <div className="page">

                <h2>Profile Error</h2>

                <p>{error}</p>

                <button onClick={() => navigate("/login")}>
                    Go to Login
                </button>

            </div>
        );
    }


    // Profile
    return (
        <div className="page">

            <div className="profile-card">

                <h1>My Profile</h1>

                <p>User details fetched from backend</p>

                <table>
                    <tbody>

                        {/* <tr>
                            <th>User ID</th>
                            <td>{profile?.id}</td>
                        </tr> */}

                        <tr>
                            <th>Name</th>
                            <td>{profile?.name}</td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>{profile?.email}</td>
                        </tr>

                        <tr>
                            <th>Mobile</th>
                            <td>{profile?.mobile}</td>
                        </tr>

                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default Profile;