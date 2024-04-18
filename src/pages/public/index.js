import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod,getMethodPostByToken,getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';


var sizepro = 20
function Home(){
    const [itemCategories, setItemCategories] = useState([]);
    const [itemProduct, setItemProduct] = useState([]);
    const [itemBlog, setItemBlog] = useState([]);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
      const getCate = async() =>{
          const result = await getMethod('http://localhost:8080/api/category/public/findAll');
          setItemCategories(result)
      };getCate();
      const getBlog = async() =>{
          const result = await getMethod('http://localhost:8080/api/blog/public/findAll-list');
          setItemBlog(result)
      };
      getBlog();
      const getProduct = async() =>{
          const result = await getMethod('http://localhost:8080/api/product/public/find-all?size='+sizepro+'&page=0');
          console.log(result);
          setItemProduct(result.content)
          setpageCount(result.totalPages)
      };
      getProduct();
  }, []);
  

  const fetchProduct = async (page) => {
    const result = await getMethod('http://localhost:8080/api/product/public/find-all?size='+sizepro+'&page='+page);
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


    return(
     <>
      <div class="bannerindex">
        <div class="container" id="courseindex">
            <div id="carouselExampleControls" class="carousel slide bannerindex" data-bs-ride="carousel">
                <div id="carouselindex">
                    <div class="carousel-inner carousel-inner-index">
                        <div class="carousel-item active">
                            <a href=""><img src={banner} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner1} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner2} class="d-block w-100"/></a>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row danhmucindex">
        {itemCategories.map((item, index)=>{
            return <div class="col-lg-10p col-md-3 col-sm-4 col-4">
                <div class="singlecategory">
                    <a href={"product?category="+item.id+"&catename="+item.name}><img src={item.image} class="imagecategory"/></a>
                </div>
                <a href={"product?category="+item.id} class="tendanhmucid">{item.name}</a>
            </div>
          })}
        </div>
        
        <h5 className='tieudeindex'>KHÁM PHÁ MÓN MỚI</h5>
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

      <h5 className='tieudeindex'>BÀI VIẾT MỚI NHẤT</h5>
      <div class="col-sm-6">
          {itemBlog.map((item, index)=>{
              return <div class="row singleblogindex">
                  <div className='col-sm-3'>
                    <img src={item.imageBanner} className='imgblogindex'/>
                  </div>
                  <div className='col-sm-9'>
                    <a href="" className='tieudebaivietindex'>{item.title}</a>
                    <span className='motabaivietindex'>{item.description}</span>
                    <span className='nguoidangblog'><i className='fa fa-user'></i> {item.user.username} - <i className='fa fa-calendar'></i> {item.createdDate}</span>
                  </div>
              </div>
          })}
      </div>
    </div>
     </>
    );
}

export default Home;
