import React, { useState, useEffect } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from "jwt-decode";
import { Helmet } from 'react-helmet-async';

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    const handleChange = (e) => { const { name, value } = e.target; setData(prev => ({ ...prev, [name]: value })); };
    const valideValue = Object.values(data).every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({ ...SummaryApi.login, data });
            if (response.data.error) { toast.error(response.data.message); return; }
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                setData({ email: "", password: "" });
                navigate("/");
            }
        } catch (error) { AxiosToastError(error); }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await Axios({ ...SummaryApi.googleLogin, data: { credential: credentialResponse.credential } });
            if (response.data.success) {
                toast.success("Login Successful with Google");
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                navigate("/");
            } else {
                toast.error(response.data.message || "Google Login Failed");
            }
        } catch (error) { AxiosToastError(error); }
    };

    return (
        <section className='w-full container mx-auto px-2'>
            <Helmet>
                <title>Nexebay - Login to Your Account</title>
                <meta name="description" content="Login to Nexebay to access your account, track orders, and shop the latest fashion trends and accessories online." />
                <meta name="keywords" content="Nexebay login, fashion login, accessories login, online shopping account" />
                <link rel="canonical" href="https://www.nexebay.com/login" />
                <meta property="og:title" content="Nexebay - Login" />
                <meta property="og:description" content="Login to Nexebay to access your account, track orders, and shop the latest fashion trends and accessories online." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.nexebay.com/login" />
                <meta property="og:image" content="https://via.placeholder.com/1200x630.png?text=Nexebay+Login" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input type='email' id='email' className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200' name='email' value={data.email} onChange={handleChange} placeholder='Enter your email' />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input type={showPassword ? "text" : "password"} id='password' className='w-full outline-none' name='password' value={data.password} onChange={handleChange} placeholder='Enter your password' />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password?</Link>
                    </div>
                    <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google Login Failed")} />
                </div>

                <p className="mt-4">Don't have an account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link></p>
            </div>
        </section>
    );
};

export default Login;
