import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemsDetails] = useState()

  const handleADDTocart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkingitem = cartItem.some(item => item.productId._id === data._id)
    setIsAvailableCart(checkingitem)

    const product = cartItem.find(item => item.productId._id === data._id)
    setQty(product?.quantity)
    setCartItemsDetails(product)
  }, [data, cartItem])

  const increaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const response = await updateCartItem(cartItemDetails?._id, qty + 1)

    if (response.success) {
      toast.success("Item added")
    }
  }

  const decreaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id)
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1)

      if (response.success) {
        toast.success("Item removed")
      }
    }
  }

  return (
    <div className="w-full max-w-[190px]">
      {isAvailableCart ? (
        <div className="flex w-full items-center rounded-lg overflow-hidden shadow-md border border-gray-300">
          {/* Decrease Button */}
          <button
            onClick={decreaseQty}
            className="w-12 h-12 flex items-center justify-center 
            bg-red-500 text-white font-bold 
            hover:bg-red-600 active:scale-95 transition-all"
          >
            <FaMinus />
          </button>

          {/* Quantity Box */}
          <p
            className="flex-1 h-12 flex items-center justify-center 
            text-lg font-bold text-gray-800 
            bg-white border-x-2 border-gray-300 shadow-inner"
          >
            {qty}
          </p>

          {/* Increase Button */}
          <button
            onClick={increaseQty}
            className="w-12 h-12 flex items-center justify-center 
            bg-green-500 text-white font-bold 
            hover:bg-green-600 active:scale-95 transition-all"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="w-full py-3 rounded-lg bg-green-500 
          text-white font-semibold shadow-md border border-gray-300 
          hover:bg-green-600 active:scale-95 transition-all"
        >
          {loading ? <Loading /> : "Add to Cart"}
        </button>
      )}
    </div>
  )
}

export default AddToCartButton
