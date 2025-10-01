import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import AddFieldComponent from '../components/AddFieldComponent';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import toast from 'react-hot-toast';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");

  // ✅ Auto-refresh once when page loads
  useEffect(() => {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      setImageLoading(true);
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const response = await uploadImage(file);
          return response.secure_url || response.url;
        })
      );
      setData(prev => ({ ...prev, image: [...prev.image, ...uploadedImages] }));
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error("Image upload failed!");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData(prev => ({ ...prev, image: updatedImages }));
  }

  const handleRemoveCategory = (index) => {
    const updatedCategory = [...data.category];
    updatedCategory.splice(index, 1);
    setData(prev => ({ ...prev, category: updatedCategory }));
  }

  const handleRemoveSubCategory = (index) => {
    const updatedSub = [...data.subCategory];
    updatedSub.splice(index, 1);
    setData(prev => ({ ...prev, subCategory: updatedSub }));
  }

  const handleAddField = () => {
    if (!fieldName) return;
    setData(prev => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: "" } }));
    setFieldName("");
    setOpenAddField(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({ ...SummaryApi.createProduct, data });
      if (response.data.success) {
        successAlert(response.data.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  return (
    <section className=''>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>

      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input 
              id='name'
              type='text'
              placeholder='Enter product name'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Description */}
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium'>Description</label>
            <textarea 
              id='description'
              placeholder='Enter product description'
              name='description'
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className='font-medium'>Image</p>
            <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
              <div className='text-center flex justify-center items-center flex-col'>
                {imageLoading ? <Loading/> : (
                  <>
                    <FaCloudUploadAlt size={35}/>
                    <p>Upload Images</p>
                  </>
                )}
              </div>
              <input 
                type='file'
                id='productImage'
                className='hidden'
                accept='image/*'
                multiple
                onChange={handleUploadImage}
              />
            </label>

            <div className='flex flex-wrap gap-4 mt-2'>
              {data.image.map((img, index) => (
                <div key={img + index} className='h-20 w-20 bg-blue-50 border relative group'>
                  <img
                    src={img}
                    alt={`product-${index}`}
                    className='w-full h-full object-scale-down cursor-pointer' 
                    onClick={() => setViewImageURL(img)}
                  />
                  <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                    <MdDelete/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className='grid gap-1'>
            <label className='font-medium'>Category</label>
            <select
              className='bg-blue-50 border w-full p-2 rounded'
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                const category = allCategory.find(el => el._id === value);
                if (category && !data.category.some(c => c._id === value)) {
                  setData(prev => ({ ...prev, category: [...prev.category, category] }));
                }
                setSelectCategory("");
              }}
            >
              <option value="">Select Category</option>
              {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <div className='flex flex-wrap gap-3 mt-2'>
              {data.category.map((c, i) => (
                <div key={c._id + i} className='text-sm flex items-center gap-1 bg-blue-50 p-1 rounded'>
                  <p>{c.name}</p>
                  <IoClose size={18} className='cursor-pointer hover:text-red-500' onClick={() => handleRemoveCategory(i)}/>
                </div>
              ))}
            </div>
          </div>

          <div className='grid gap-1'>
            <label className='font-medium'>Sub Category</label>
            <select
              className='bg-blue-50 border w-full p-2 rounded'
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                const subCategory = allSubCategory.find(el => el._id === value);
                if (subCategory && !data.subCategory.some(s => s._id === value)) {
                  setData(prev => ({ ...prev, subCategory: [...prev.subCategory, subCategory] }));
                }
                setSelectSubCategory("");
              }}
            >
              <option value="">Select Sub Category</option>
              {allSubCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <div className='flex flex-wrap gap-3 mt-2'>
              {data.subCategory.map((c, i) => (
                <div key={c._id + i} className='text-sm flex items-center gap-1 bg-blue-50 p-1 rounded'>
                  <p>{c.name}</p>
                  <IoClose size={18} className='cursor-pointer hover:text-red-500' onClick={() => handleRemoveSubCategory(i)}/>
                </div>
              ))}
            </div>
          </div>

          {/* Unit, Stock, Price, Discount */}
          {['unit', 'stock', 'price', 'discount'].map(field => (
            <div key={field} className='grid gap-1'>
              <label htmlFor={field} className='font-medium'>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                type={field==='stock' || field==='price' || field==='discount' ? 'number' : 'text'}
                name={field}
                value={data[field]}
                onChange={handleChange}
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                required={field!=='discount'}
              />
            </div>
          ))}

          {/* Dynamic Fields */}
          {Object.keys(data.more_details).map((k, i) => (
            <div key={i} className='grid gap-1'>
              <label className='font-medium'>{k}</label>
              <input
                type='text'
                value={data.more_details[k]}
                onChange={(e) => setData(prev => ({ ...prev, more_details: { ...prev.more_details, [k]: e.target.value } }))}
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
          ))}

          <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold' type='submit'>Submit</button>
        </form>
      </div>

      {/* Modals */}
      {viewImageURL && <ViewImage url={viewImageURL} close={() => setViewImageURL("")}/>}
      {openAddField && <AddFieldComponent value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} close={() => setOpenAddField(false)}/>}
    </section>
  );
}

export default UploadProduct;
