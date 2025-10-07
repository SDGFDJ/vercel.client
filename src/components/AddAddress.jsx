import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset } = useForm()
  const { fetchAddress } = useGlobalContext()

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accesstoken');

      const response = await Axios({
        ...SummaryApi.createAddress,
        headers: { Authorization: `Bearer ${token}` },
        data
      });

      if (response.data.success) {
        toast.success(response.data.message)
        close && close()
        reset()
        fetchAddress()
      } else {
        toast.error(response.data.message || "Failed to add address")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 flex justify-center items-start overflow-y-auto'>
      <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded-lg shadow-lg relative'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-lg'>Add Address</h2>
          <button onClick={close} className='hover:text-red-500'>
            <IoClose size={25} />
          </button>
        </div>

        {/* Form */}
        <form
          className='mt-4 grid gap-4 pb-20'  // ✅ Added bottom padding for mobile space
          onSubmit={handleSubmit(onSubmit)}
        >
          {[
            ["name", "Name"],
            ["building", "Building / House No"],
            ["address_line", "Address Line"],
            ["district", "District"],
            ["city", "City"],
            ["state", "State"],
            ["country", "Country"],
            ["pincode", "Pincode"],
            ["mobile", "Mobile No"]
          ].map(([key, label]) => (
            <div key={key} className='grid gap-1'>
              <label>{label} :</label>
              <input
                {...register(key, { required: true })}
                className='border bg-blue-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          ))}

          {/* Fixed Submit Button for Mobile */}
          <div className='fixed bottom-0 left-0 right-0 bg-white p-3 border-t md:static md:p-0 md:border-none'>
            <button
              type='submit'
              className='bg-primary-200 w-full py-2 font-semibold rounded hover:bg-primary-100 transition'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddAddress
