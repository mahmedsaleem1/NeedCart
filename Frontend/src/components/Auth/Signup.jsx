import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {googleLogin} from '../../config/firebase/auth.config.js';
import { useDispatch } from 'react-redux';
import { login, signup } from "../../store/auth.slice.js";
import { useSelector } from 'react-redux';
import { Footer } from '../index.js';
import { Navbar } from '../index.js';

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
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [registrationEmail, setRegistrationEmail] = useState("");
    const [registrationData, setRegistrationData] = useState(null);

    const password = watch("password");

    const handleSignup = async (data) => {
        setIsLoading(true);
        setMessage("");
        
        try {
            const { email, role, password } = data;
            const response = await fetch(`${import.meta.env.VITE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, role, password}),
            });            

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Server returned non-JSON response:", response.status, response.statusText);
                setMessage("Server error. Please check if the backend is running and try again.");
                return;
            }

            const result = await response.json();
            
            if (response.ok && result.success) {
                // OTP sent successfully, show OTP modal
                setRegistrationEmail(email);
                setRegistrationData({ email, role });
                setShowOTPModal(true);
                setMessage("OTP sent to your email. Please check your inbox.");
            } else {
                setMessage(result.message || "Failed to send OTP. Please try again.");
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

    const handleVerifyOTP = async (otp) => {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: registrationEmail, otp }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessage("Account created successfully! Redirecting to login...");
                setShowOTPModal(false);
                dispatch(signup({ role: registrationData.role }));
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(result.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.log("Error verifying OTP:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: registrationEmail }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessage("New OTP sent to your email!");
            } else {
                setMessage(result.message || "Failed to resend OTP.");
            }
        } catch (error) {
            console.log("Error resending OTP:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };        

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
                        Create Account
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        Sign up to get started with NeedCart
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
                            onFocus={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#059669'}
                            onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#e1e5e9'}
                        />
                        {errors.email && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <select
                            {...register("role", { required: "Please select a role" })}
                            defaultValue="Buyer"
                            style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: `2px solid ${errors.role ? '#dc3545' : '#e1e5e9'}`,
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = errors.role ? '#dc3545' : '#059669'}
                            onBlur={(e) => e.target.style.borderColor = errors.role ? '#dc3545' : '#e1e5e9'}
                        >
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                        </select>
                        {errors.role && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {errors.role.message}
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
                            onFocus={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#059669'}
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
                            onFocus={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#059669'}
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
                            backgroundColor: isLoading ? '#6c757d' : '#10b981',
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
                                e.target.style.backgroundColor = '#059669';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = '#10b981';
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
                            color: '#10b981',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Sign in here
                    </button>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOTPModal && (
                <OTPModal
                    email={registrationEmail}
                    onVerify={handleVerifyOTP}
                    onResend={handleResendOTP}
                    onClose={() => setShowOTPModal(false)}
                    isLoading={isLoading}
                    message={message}
                />
            )}

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
};

// OTP Modal Component
const OTPModal = ({ email, onVerify, onResend, onClose, isLoading, message }) => {
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            onVerify(otpCode);
        }
    };

    const handleResend = () => {
        onResend();
        setTimer(600);
        setCanResend(false);
        setOTP(['', '', '', '', '', '']);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                width: '90%',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '24px' }}>
                    Verify Your Email
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
                    We've sent a 6-digit OTP to<br />
                    <strong>{email}</strong>
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            style={{
                                width: '50px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                border: '2px solid #e1e5e9',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />
                    ))}
                </div>

                {message && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: message.includes("successfully") || message.includes("sent") ? '#d4edda' : '#f8d7da',
                        color: message.includes("successfully") || message.includes("sent") ? '#155724' : '#721c24'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                    Time remaining: <strong>{formatTime(timer)}</strong>
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.join('').length !== 6}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: isLoading || otp.join('').length !== 6 ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: isLoading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {canResend ? (
                    <button
                        onClick={handleResend}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'white',
                            color: '#007bff',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        Resend OTP
                    </button>
                ) : (
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                        Didn't receive OTP? Resend available in {formatTime(timer)}
                    </p>
                )}

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Signup;
