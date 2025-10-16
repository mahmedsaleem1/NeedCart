import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {googleLogin} from '../config/firebase/auth.config.js';
import { useDispatch } from 'react-redux';
import { login } from "../store/auth.slice";
import { useSelector } from 'react-redux';

const Signup = () => {
    const user = useSelector((state) => state.auth.user);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const password = watch("password");

    const handleSignup = async (data) => {
        setIsLoading(true);
        setMessage("");
        
        try {
            const { email, password } = data;
            const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            console.log(response);
            

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Server returned non-JSON response:", response.status, response.statusText);
                setMessage("Server error. Please check if the backend is running and try again.");
                return;
            }

            const result = await response.json();
            
            if (response.ok && result.data && result.data.user) {
                setMessage("Account created successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(result.message || "Failed to create account. Please try again.");
            }
            
        } catch (error) {
            console.log("Error creating account:", error);
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
    };

    const handleGoogleLogin = async () => {
        try {
            const userData = await googleLogin();

            const serializableUserData = {
                email: userData.email,
                displayName: userData.displayName,
                photoURL: userData.photoURL,
            };

            dispatch(login(serializableUserData));
            navigate("/");
        } catch (error) {
            setMessage("Google login failed. Please try again.");
        }
    };        

    return (
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
                        Create Account
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        Sign up to get started with AirBridge
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleSignup)} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <input 
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                            placeholder="Enter your email address" 
                            type="email"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${errors.email ? '#dc3545' : '#e1e5e9'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#fff',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#e1e5e9'}
                        />
                        {errors.email && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input 
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })} 
                            placeholder="Enter your password" 
                            type="password"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${errors.password ? '#dc3545' : '#e1e5e9'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#fff',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#e1e5e9'}
                        />
                        {errors.password && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input 
                            {...register("confirmPassword", { 
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })} 
                            placeholder="Confirm your password" 
                            type="password"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#e1e5e9'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#fff',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#e1e5e9'}
                        />
                        {errors.confirmPassword && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>
                    
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
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:shadow-md px-4 py-2 rounded-lg font-medium transition duration-200"
                    >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                </form>

                {message && (
                    <div style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: message.includes("successfully") ? '#d4edda' : '#f8d7da',
                        color: message.includes("successfully") ? '#155724' : '#721c24',
                        border: `1px solid ${message.includes("successfully") ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Sign in here
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Signup;