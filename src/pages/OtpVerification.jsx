import React, { useEffect, useRef, useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""]);
    const navigate = useNavigate();
    const inputRef = useRef([]);
    const location = useLocation();

    useEffect(() => {
        if(!location?.state?.email){
            navigate("/forgot-password");
        }
    }, []);

    const valideValue = data.every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            });

            if(response.data.error){
                toast.error(response.data.message);
            }

            if(response.data.success){
                toast.success(response.data.message);
                setData(["","","","","",""]);
                navigate("/reset-password", {
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='w-full min-h-screen bg-gray-50 flex items-center justify-center px-2 py-6'>
            <Helmet>
                <title>OTP Verification - Nexebay</title>
                <meta name="description" content="Enter OTP to verify your account and reset password on Nexebay." />
                <meta name="keywords" content="Nexebay, OTP Verification, Reset Password, Account Verification" />
                <link rel="canonical" href="https://www.nexebay.com/otp-verification" />
                <meta property="og:title" content="OTP Verification - Nexebay" />
                <meta property="og:description" content="Enter OTP to verify your account and reset password on Nexebay." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.nexebay.com/otp-verification" />
            </Helmet>

            <div className='bg-white w-full max-w-lg rounded p-7 shadow-md'>
                <p className='font-semibold text-lg'>Enter OTP</p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='otp'>Enter Your OTP :</label>
                        <div className='flex items-center gap-2 justify-between mt-3 overflow-x-auto'>
                            {data.map((element, index) => (
                                <input
                                    key={"otp"+index}
                                    type='text'
                                    ref={ref => inputRef.current[index] = ref}
                                    value={data[index]}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, "");
                                        const newData = [...data];
                                        newData[index] = value;
                                        setData(newData);
                                        if(value && index < 5){
                                            inputRef.current[index+1]?.focus();
                                        }
                                    }}
                                    maxLength={1}
                                    className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                                />
                            ))}
                        </div>
                    </div>
                    <button 
                        disabled={!valideValue} 
                        className={`w-full ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Verify OTP
                    </button>
                </form>
                <p className="text-sm">
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
    );
};

export default OtpVerification;
