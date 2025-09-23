import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({close}) => {
    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data)=>{
        try {
            // Get token if required by backend
            const token = localStorage.getItem('accesstoken');

            const response = await Axios({
                ...SummaryApi.createAddress, // should have url and method: POST
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    name: data.name,
                    building: data.building,
                    address_line: data.address_line,
                    district: data.district,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            });

            if(response.data.success){
                toast.success(response.data.message)
                if(close){
                    close()
                    reset()
                    fetchAddress() // refresh address list
                }
            } else {
                toast.error(response.data.message || "Failed to add address")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose  size={25}/>
                    </button>
                </div>

                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label>Name :</label>
                        <input {...register("name",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>Building / House No :</label>
                        <input {...register("building",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>Address Line :</label>
                        <input {...register("address_line",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>District :</label>
                        <input {...register("district",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>City :</label>
                        <input {...register("city",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>State :</label>
                        <input {...register("state",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>Country :</label>
                        <input {...register("country",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>Pincode :</label>
                        <input {...register("pincode",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>
                    <div className='grid gap-1'>
                        <label>Mobile No :</label>
                        <input {...register("mobile",{required:true})} className='border bg-blue-50 p-2 rounded'/>
                    </div>

                    <button type='submit' className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress
