import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { Helmet } from 'react-helmet-async';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  useEffect(() => {
    window.scrollTo(0, 0) // Page always opens from top
  }, [])

  const handleDisableAddress = async(id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id }
      })
      if(response.data.success){
        toast.success("Address Removed")
        if(fetchAddress) fetchAddress()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <>
      {/* SEO Tags */}
      <Helmet>
        <title>My Addresses - Nexebay | Manage Delivery & Billing Addresses</title>
        <meta 
          name="description" 
          content="Manage all your saved delivery and billing addresses on Nexebay. Add, edit, or remove addresses for faster checkout and seamless shopping experience." 
        />
        <meta name="keywords" content="Nexebay, addresses, delivery address, billing address, edit address, remove address, user account" />
        <link rel="canonical" href="https://www.nexebay.com/dashboard/address" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "User Addresses",
            "description": "List of delivery addresses saved by the user for Nexebay checkout",
            "itemListElement": addressList.map((address, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": address.name,
              "address": `${address.building}, ${address.address_line}, ${address.district}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`,
              "telephone": address.mobile
            }))
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-8">
          My Addresses
        </h1>
        <p className="text-gray-700 mb-6">
          Manage all your delivery and billing addresses here. Add new addresses, edit existing ones, or remove any outdated addresses for faster checkout on Nexebay.
        </p>

        {/* Add Address Button */}
        <div className='flex justify-end mb-4'>
          <button 
            onClick={() => setOpenAddress(true)} 
            className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'>
            Add New Address
          </button>
        </div>

        {/* Address List */}
        <div className='grid gap-4'>
          {addressList.map((address, index) => address.status && (
            <div key={index} className='border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm'>
              <div className='w-full md:w-3/4'>
                <p><strong>Name:</strong> {address.name}</p>
                <p><strong>Building/House No:</strong> {address.building}</p>
                <p><strong>Address:</strong> {address.address_line}</p>
                <p><strong>District:</strong> {address.district}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Country:</strong> {address.country}</p>
                <p><strong>Pincode:</strong> {address.pincode}</p>
                <p><strong>Mobile:</strong> {address.mobile}</p>
              </div>
              <div className='flex gap-2 mt-3 md:mt-0'>
                <button 
                  onClick={() => { setOpenEdit(true); setEditData(address) }} 
                  className='bg-green-200 p-2 rounded hover:bg-green-600 hover:text-white transition'>
                  <MdEdit size={22} />
                </button>
                <button 
                  onClick={() => handleDisableAddress(address._id)} 
                  className='bg-red-200 p-2 rounded hover:bg-red-600 hover:text-white transition'>
                  <MdDelete size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        {OpenEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
      </div>
    </>
  )
}

export default Address
