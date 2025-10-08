import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { Helmet } from 'react-helmet-async'

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({ name: "", image: "" })
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({ _id: "" })

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({ ...SummaryApi.getCategory })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        fetchCategory()
    }, [])

    return (
        <section className=''>
            {/* SEO Tags */}
            <Helmet>
                <title>Manage Categories - Nexebay Admin</title>
                <meta
                    name="description"
                    content="Admin panel to manage product categories at Nexebay. Add, edit, or delete categories for your e-commerce store."
                />
                <meta
                    name="keywords"
                    content="Nexebay admin, category management, add category, edit category, delete category, e-commerce admin panel"
                />
                <link rel="canonical" href="https://www.nexebay.com/dashboard/category" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Nexebay Categories",
                        "description": "List of product categories managed by the admin.",
                        "itemListElement": categoryData.map((cat, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "name": cat.name,
                            "image": cat.image
                        }))
                    })}
                </script>
            </Helmet>

            {/* Header Section */}
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Category Management</h2>
                <button
                    onClick={() => setOpenUploadCategory(true)}
                    className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'
                >
                    Add Category
                </button>
            </div>

            {/* No Data */}
            {!categoryData[0] && !loading && <NoData />}

            {/* Category Grid */}
            <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                {categoryData.map((category) => (
                    <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                        <img
                            alt={category.name}
                            src={category.image}
                            className='w-full object-scale-down'
                        />
                        <div className='items-center h-9 flex gap-2 mt-1'>
                            <button
                                onClick={() => {
                                    setOpenEdit(true)
                                    setEditData(category)
                                }}
                                className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }}
                                className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading */}
            {loading && <Loading />}

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
            )}
            {openEdit && (
                <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
            )}
            {openConfimBoxDelete && (
                <CofirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                />
            )}
        </section>
    )
}

export default CategoryPage
