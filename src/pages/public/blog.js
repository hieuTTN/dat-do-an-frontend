import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import index2img from '../../assest/images/index2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'
import ReactPaginate from 'react-paginate';

var size = 6

function PublicBlog(){
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
      const getBlog = async() =>{
          var result = await getMethod('http://localhost:8080/api/blog/public/findAll-page?page=0&size=' + size + '&sort=id,desc');
          var list = result.content;
          var totalPage = result.totalPages;
          setItems(list)
          setpageCount(totalPage)
      };
      getBlog();
  }, []);

  console.log(items);
  
  const handlePageClick = async (data)=>{
    var currentPage = data.selected
    var result = await getMethod('http://localhost:8080/api/blog/public/findAll-page?page='+currentPage+'&size=' + size + '&sort=id,desc');
    var list = result.content;
    var totalPage = result.totalPages;
    setItems(list)
    setpageCount(totalPage)
}

    return(
        <div className="contentmain">
        <div id="listblog" class="row">
        {items.map((item, index)=>{
            return <div class="col-lg-4 col-md-6 col-sm-12 col-12 singleblog">
                <div class="row">
                    <div class="col-5">
                        <a href={"blogdetail?id="+item.id}><img src={item.imageBanner} class="imgblog"/></a>
                    </div>
                    <div class="col-7 cntblog">
                        <a href={"blogdetail?id="+item.id} class="titleblog">{item.title}</a>
                        <span class="desbloglist">{item.description}</span>
                        <div>
                            <img src={avatar} class="avtblog"/>
                            <span class="userdbg">{item.user.fullname}</span>
                            <span class="timeblog"><i class="fa fa-clock"></i> {item.createdDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        })}
        </div><br/><br/>
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
    );
}

export default PublicBlog;
