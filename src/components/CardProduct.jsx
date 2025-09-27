import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)

  return (
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-2 lg:gap-3 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition"
    >
     <div className="w-full h-40 lg:h-52 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
  <img
    src={data.image[0]}
    alt={data.name}
    className="w-full h-full object-contain"   // ✅ Image पूरा दिखेगा
  />
</div>


      {/* Tags (Delivery time & Discount) */}
      <div className="flex items-center gap-2 px-2 lg:px-0">
        <div className="rounded text-xs w-fit px-2 py-[2px] text-green-600 bg-green-50">
          10 min
        </div>
        {Boolean(data.discount) && (
          <p className="text-green-600 bg-green-100 px-2 py-[2px] w-fit text-xs rounded-full">
            {data.discount}% off
          </p>
        )}
      </div>

      {/* Product Name */}
      <div className="px-2 lg:px-0 font-medium text-sm lg:text-base line-clamp-2 text-gray-800">
        {data.name}
      </div>

      {/* Unit */}
      <div className="px-2 lg:px-0 text-sm lg:text-base text-gray-600">
        {data.unit}
      </div>

      {/* Price & Add to Cart */}
      <div className="px-2 lg:px-0 flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-900 text-sm lg:text-base">
          {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
        </div>

        <div>
          {data.stock === 0 ? (
            <p className="text-red-500 text-xs lg:text-sm text-center">
              Out of stock
            </p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  )
}

export default CardProduct
