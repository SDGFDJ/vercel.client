import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  console.log(AllSubCategory);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id === categoryId;
      });
      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr] gap-4 p-4">
        {/** Sub-Category Sidebar **/}
        <div className="bg-white shadow-md rounded-lg p-2 md:p-4 h-full min-h-[calc(100vh-128px)] max-h-[calc(100vh-128px)] overflow-y-auto scrollbarCustom">
          {DisplaySubCatory.map((s, index) => {
            const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`;
            return (
              <Link
                to={link}
                key={s._id}
                className={`w-full flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-green-100 transition-colors duration-200 ${
                  subCategoryId === s._id ? "bg-green-100" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                  <span className="text-sm md:text-base font-medium">{s.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/** Product Section **/}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold text-lg md:text-xl mb-4">{subCategoryName}</h3>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((p, index) => (
                <CardProduct
                  data={p}
                  key={p._id + "productSubCategory" + index}
                />
              ))}
            </div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;