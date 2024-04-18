import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod,getMethodPostByToken,getMethodByToken, getMethodPostPayload} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


var sizepro = 20
var uls = new URL(document.URL)
var category = uls.searchParams.get("category");
var search = uls.searchParams.get("search");
var catename = uls.searchParams.get("catename");
var url = '';


function PublicProduct(){
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 5
      };
    const [itemCategories, setItemCategories] = useState([]);
    const [itemProduct, setItemProduct] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [tuKhoa, setTuKhoa] = useState("");

    useEffect(()=>{
      const getCate = async() =>{
          const result = await getMethod('http://localhost:8080/api/category/public/findAll');
          setItemCategories(result)
      };getCate();

      if(search != null){
        setTuKhoa(search)
      }
      if(catename != null){
        setTuKhoa(catename)
      }
      const getProduct = async() =>{
        if(category != null){
            url = 'http://localhost:8080/api/product/public/search-san-pham?size='+sizepro + '&idcategory='+category ;
        }
        if(search != null){
            url = 'http://localhost:8080/api/product/public/search-san-pham?size='+sizepro + '&search='+search;
        }
        const result = await getMethod(url+ '&page=0');
        console.log(result);
        setItemProduct(result.content)
        setpageCount(result.totalPages)
      };
      getProduct();
    }, []);
  

    const fetchProduct = async (page) => {
        const result = await getMethod(url+'&page='+page);
        setItemProduct(result.content)
        setpageCount(result.totalPages);
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        await fetchProduct(currentPage);
    }

    const addToCart = async (id) => {
    const result = await getMethodPostByToken('http://localhost:8080/api/cart/user/create?idproduct='+id);
    if(result.status < 300){
        toast.success("Thêm giỏ hàng thành công");
        const response = await getMethodByToken('http://localhost:8080/api/cart/user/count-cart');
        var numc = await response.text();
        document.getElementById("soluongcart").innerHTML = numc
    }
    else{
        toast.warning("Hãy đăng nhập");
    }
    };

    const searchFull = async() =>{
        var obj = {
            "search":document.getElementById("search").value,
            "category":document.getElementById("danhmuc").value == -1?null:document.getElementById("danhmuc").value,
            "small":document.getElementById("mucgia").value.split("-")[0],
            "large":document.getElementById("mucgia").value.split("-")[1],
        }
        var sort = document.getElementById("sort").value
        url = 'http://localhost:8080/api/product/public/search-full-san-pham?size='+sizepro+'&sort='+sort
        const response = await getMethodPostPayload(url+ '&page=0', obj);
        var result = await response.json();
        console.log(result);
        setItemProduct(result.content)
        setpageCount(result.totalPages)
    };


    return(
     <>
    <div class="container">
        <Slider {...settings} className='sliderproduct'>
        {itemCategories.map((item, index)=>{
            return <><div class="singlecategory">
                    <a href={"product?category="+item.id+"&catename="+item.name}><img src={item.image} class="imagecategory"/></a>
                </div>
                <a href={"product?category="+item.id} class="tendanhmucid">{item.name}</a></>
          })}
        </Slider>
        <h5 className='tieudeindex'>Tìm kiếm từ khóa: {tuKhoa}</h5>
        <div class="headerfilterpro">
               <h3>Tìm kiếm và xắp xếp</h3> 
               <hr/>
               <div class="row">
                    <div class="col-lg-20p col-md-3 col-sm-6 col-6">
                        <input id="search" class="form-control" placeholder="Tên sản phẩm"/>
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-6 col-6">
                        <select id="danhmuc" class="form-control">
                            <option value={-1}>Tất cả danh mục</option>
                            {itemCategories.map((item, index)=>{
                                return <option value={item.id}>{item.name}</option>
                            })}
                        </select>
                    </div>
                    <div class="col-lg-20p col-md-3 col-sm-6 col-6">
                        <select id="mucgia" class="form-control">
                            <option value="0-1000000000">Tất cả mức giá</option>
                            <option value="0-19999">Dưới 20.000đ</option>
                            <option value="20000-30000">Từ 20.000-30.000đ</option>
                            <option value="30000-40000">Từ 30.000-40.000đ</option>
                            <option value="40000-60000">Từ 40.000-60.000đ</option>
                            <option value="60000-80000">Từ 60.000đ-100.000đ</option>
                            <option value="100000-1000000000">Trên 100.000đ</option>
                        </select>
                    </div>
                    <div class="col-lg-20p col-md-3 col-sm-6 col-6">
                        <select id="sort" class="form-control">
                            <option value="id,desc">Sắp xếp tự động</option>
                            <option value="price,asc">Giá tăng dần</option>
                            <option value="price,desc">Giá giảm dần</option>
                        </select>
                    </div>
                    <div class="col-lg-20p col-md-3 col-sm-6 col-6">
                        <button onClick={()=>searchFull()} class="btn btn-danger form-control">Lọc sản phẩm</button>
                    </div>
               </div>
            </div>
        <div className='row'>
        {itemProduct.map((item, index)=>{
          return <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
            <div className='singleproduct'>
              <a href={"detail?id="+item.id}><img src={item.imageBanner} className='imgproductindex'/></a>
              <div className='contentprodiv'>
                <a href={"detail?id="+item.id} className='tenspindex tenspid'>{item.name}</a>
                <p className='tenspindex giaspindex'>{formatMoney(item.price)} <span className='giacuspindex'>{item.oldPrice == null?'':formatMoney(item.oldPrice)}</span> </p>
                <button onClick={()=>addToCart(item.id)} className='btngiohang'>Giỏ hàng</button>
              </div>
            </div>
          </div>
        })}
        </div>

        <ReactPaginate 
          marginPagesDisplayed={2} 
          pageCount={pageCount} 
          onPageChange={handlePageClick}
          containerClassName={'pagination'} 
          pageClassName={'page-item'} 
          pageLinkClassName={'page-link'}
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakClassName='page-item'
          breakLinkClassName='page-link' 
          activeClassName='active'/>

    </div>
     </>
    );
}

export default PublicProduct;
