import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Footer } from '../index.js';
import { Navbar } from '../index.js';

const ForgetPassword = () => {
    
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleForgetPassword = async (data) => {
        
        setIsLoading(true);
        setMessage("");
        
        try {
            const { email } = data;
            const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            console.log("hello", response);
            

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Server returned non-JSON response:", response.status, response.statusText);
                setMessage("Server error. Please check if the backend is running and try again.");
                return;
            }

            const result = await response.json();
            console.log(result);
            
            if (response.ok && result.data && result.data.link) {
                setMessage("Please check your email for the password reset link.");

            } else {
                setMessage(result.message || "Failed to generate reset link. Please try again.");
            }
            
        } catch (error) {
            console.log("Error generating reset password link:", error);
            if (error.message.includes("Unexpected token")) {
                setMessage("Server error. Please check if the backend is running on port 8000.");
            } else if (error.name === "TypeError" && error.message.includes("fetch")) {
                setMessage("Cannot connect to server. Please check your connection and try again.");
            } else {
                setMessage("An error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <Navbar  />
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        color: '#333',
                        fontSize: '24px',
                        fontWeight: '600'
                    }}>
                        Forgot Password?
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        Enter your email address and we'll send you a reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleForgetPassword)} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <input 
                        {...register("email")} 
                        placeholder="Enter your email address" 
                        required 
                        type="email"
                        style={{
                            padding: '14px 16px',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
                            backgroundColor: '#fff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                            padding: '14px 20px',
                            backgroundColor: isLoading ? '#6c757d' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = '#0056b3';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = '#007bff';
                            }
                        }}
                    >
                        {isLoading && (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ffffff',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                        {isLoading ? "Sending..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <div style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: message.includes("Redirecting") ? '#d4edda' : '#f8d7da',
                        color: message.includes("Redirecting") ? '#155724': '#155724',
                        border: `1px solid ${message.includes("Redirecting") ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
        <Footer />
        </>
    );
}

export default ForgetPassword;


