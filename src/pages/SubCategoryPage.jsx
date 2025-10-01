import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete  } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({ _id : "" })
  const [deleteSubCategory,setDeleteSubCategory] = useState({ _id : "" })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async()=> {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const { data: responseData } = response

      if(responseData.success) setData(responseData.data)
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    // Page top se open ho
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    fetchSubCategory()
  },[])

  const handleDeleteSubCategory = async()=> {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })
      const { data: responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const column = [
    columnHelper.accessor('name',{ header: "Name" }),
    columnHelper.accessor('image',{
      header: "Image",
      cell: ({ row }) => (
        <div className='flex justify-center items-center'>
          <img
            src={row.original.image}
            alt={row.original.name}
            className='w-10 h-10 cursor-pointer rounded-md shadow-sm hover:scale-105 transition'
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      )
    }),
    columnHelper.accessor("category",{
      header: "Category",
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {row.original.category.map(c => (
            <span key={c._id} className='shadow-md px-1 py-0.5 rounded bg-gray-100 text-sm'>{c.name}</span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("_id",{
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-3'>
          <button onClick={()=> { setOpenEdit(true); setEditData(row.original) }}
            className='p-2 bg-green-100 rounded-full hover:bg-green-200 text-green-600 transition'>
            <HiPencil size={20}/>
          </button>
          <button onClick={()=> { setOpenDeleteConfirmBox(true); setDeleteSubCategory(row.original) }}
            className='p-2 bg-red-100 rounded-full hover:bg-red-200 text-red-600 transition'>
            <MdDelete size={20}/>
          </button>
        </div>
      )
    })
  ]

  return (
    <section className='p-2'>
      {/* Header */}
      <div className='p-2 bg-white shadow-md flex items-center justify-between rounded-md mb-2'>
        <h2 className='font-semibold text-lg'>Sub Category</h2>
        <button
          onClick={()=>setOpenAddSubCategory(true)}
          className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded transition'
        >
          Add Sub Category
        </button>
      </div>

      {/* Table */}
      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable data={data} column={column} />
      </div>

      {/* Add Modal */}
      {openAddSubCategory && (
        <UploadSubCategoryModel close={()=>setOpenAddSubCategory(false)} fetchData={fetchSubCategory}/>
      )}

      {/* View Image Modal */}
      {ImageURL && <ViewImage url={ImageURL} close={()=>setImageURL("")}/>}

      {/* Edit Modal */}
      {openEdit && <EditSubCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchSubCategory}/>}

      {/* Confirm Delete Modal */}
      {openDeleteConfirmBox && (
        <CofirmBox cancel={()=>setOpenDeleteConfirmBox(false)} close={()=>setOpenDeleteConfirmBox(false)} confirm={handleDeleteSubCategory}/>
      )}
    </section>
  )
}

export default SubCategoryPage
