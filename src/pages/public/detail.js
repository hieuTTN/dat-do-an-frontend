import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {getMethod,getMethodPostByToken,getMethodByToken,uploadMultipleFile, getMethodPostPayload} from '../../services/request'
import Swal from 'sweetalert2'

var star = 5;

function loadStar(val) {
    star = val + 1;
    var listS = document.getElementById("liststar").getElementsByClassName("fa-star");
    for (var i = 0; i < listS.length; i++) {
        listS[i].classList.remove('checkedstar');
    }
    for (var i = 0; i < listS.length; i++) {
        if (i <= val) {
            listS[i].classList.add('checkedstar');
        }
    }

}

var token = localStorage.getItem("token");

function PublicDetailProduct(){
    const [product, setProduct] = useState(null);
    const [productImage, setProductImage] = useState([]);
    const [comments, setComment] = useState([]);
    const [productLq, setProductLq] = useState([]);
    useEffect(()=>{
      const getProduct = async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var result = await getMethod('http://localhost:8080/api/product/public/findById?id=' + id);
        setProduct(result)
        setProductImage(result.productImages)
      };
      getProduct();
      const getComment = async() =>{
        initComment();
      };
      getComment();
      const getProductLq = async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var result = await getMethod('http://localhost:8080/api/product/public/san-pham-lien-quan?id=' + id);
        setProductLq(result)
      };
      getProductLq();
  }, []);

  function openChooseFile(){
    document.getElementById("choosefilecmt").click();
  }

  function setFile(){
    var count = document.getElementById("choosefilecmt").files.length;
    document.getElementById("slfile").innerHTML = "Đã chọn "+count+" ảnh";
  }

  const initComment = async() =>{
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const response = await fetch('http://localhost:8080/api/product-comment/public/find-by-product?idproduct=' + id, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    setComment(result)
  };


  async function saveComment() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (document.getElementById("choosefilecmt").files.length > 3) {
        toast.error("Chỉ được chọn tối đa 3 ảnh");
        return;
    }
    var listLinkImg = await uploadMultipleFile(document.getElementById("choosefilecmt").files);
    var comment = {
        "star": star,
        "content": document.getElementById("noidungbl").value,
        "listLink": listLinkImg,
        "product": {
            "id": id
        }
    }
    const response = await getMethodPostPayload('http://localhost:8080/api/product-comment/user/create', comment)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Đã đăng bình luận của bạn",
            preConfirm: () => {
                window.location.reload();
            }
        });
    } else {
        toast.error("Thất bại!");
        document.getElementById("loading").style.display = 'none'
    }
    document.getElementById("loading").style.display = 'none'
}

async function deleteComment(id){
    var con = window.confirm("Bạn chắc chắn muốn xóa bình luận này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-comment/user/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toast.success("xóa thành công!");
        initComment();
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.defaultMessage);
    }
}


const addToCart = async () => {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
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

const muaNgay = async () => {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const result = await getMethodPostByToken('http://localhost:8080/api/cart/user/create?idproduct='+id);
    if(result.status < 300){
        window.location.href = 'cart'
    }
    else{
        toast.warning("Hãy đăng nhập");
    }
};


    return(
        <>
        <div className='container divchitietsp'>
        <div class="row">
            <div class="col-sm-8">
                <div className='sessioncontent'>
                <h4 class="pronamedetail" id="detailnamepro">{product == null?'':product.name}</h4>
                <div class="row">
                    <div class="col-sm-5">
                        <img id="imgdetailpro" src={product == null?'':product.imageBanner} class="imgprodetail"/>
                        <div class="listimgdetail row" id="listimgdetail">
                        {productImage.map((item, index)=>{
                            return <div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
                                <img onclick="clickImgdetail(this)" src={item.linkImage} className={index != 0 ? 'imgldetail':'imgldetail imgactive'}/>
                            </div>
                        })}
                        </div>
                    </div>
                    <div class="col-sm-7">
                        <div>
                            <strong class="newpricestr" id="pricedetail">{product == null?'':formatMoney(product.price)}</strong>
                            <span class="oldpricestr" id="oldpricestr">{product == null?'':product.oldPrice == null?'':formatMoney(product.oldPrice)}</span>
                        </div>
                        <span>Đã bán: {product == null?'':product.quantitySold} sản phẩm</span><br/>
                        <span>Hạn sử dụng: {product == null?'':product.expiry}</span>
                        <div className='divcamket'>
                            <h5 className='tieudecamket'>Tất cả sản phẩm chúng tôi bán ra đều cam kết</h5>
                            <span className='spcamket'><i className='fa fa-check'></i> Sản phẩm rõ nguồn gốc</span>
                            <span className='spcamket'><i className='fa fa-check'></i> Hạn sử dụng dài</span>
                            <span className='spcamket'><i className='fa fa-check'></i> Trả lại sản phẩm nếu phát hiện hết hạn</span>
                        </div>
                        <div class="divfreeship">
                            <span>FREE SHIP ĐƠN HÀNG BÁN KÍNH DƯỚI 5KM </span>
                        </div>
                        <div class="btnmuahangngay">
                            <button onClick={()=>muaNgay()} class="btnmuangay">Mua ngay <span class="lbgiaotannha">Giao tận nhà (COD)</span></button>
                            <button onClick={()=>addToCart()} class="btnthemgiohang"><i class="fa fa-shopping-cart iconcartdt"></i>Thêm giỏ hàng</button>
                        </div>
                    </div>
                </div>
                <div class="motasanphamdetail">
                    <h5 className='tieudecamket'>Mô tả sản phẩm</h5>
                    <div id="descriptiondetail" dangerouslySetInnerHTML={{__html:product == null?'':product.description}}></div>
                </div>
                <div class="phanhoisanpham">
                    <p class="titledes">Phản hổi</p>
                    <div class="listcautlct" id="listcautlct">
                    {comments.map((item, index)=>{
                        return <div class="singlectlct">
                            <div class="row">
                                <div class="col-11">
                                    <div class="d-flex nguoidangctl">
                                        <span class="usernamedangctl">{item.user.username}</span>
                                        <span class="ngaytraloi">{item.createdTime}, {item.createdDate}</span>
                                        <span class="ngaytraloi">{item.star} <span class="fa fa-star checkedstar"></span></span>
                                        {item.isMyComment==true?<span class="xoacmnt"><i onClick={()=>deleteComment(item.id)} class="fa fa-trash pointer"></i></span>:''}
                                    </div>
                                    <div class="contentctlct">{item.content}</div>
                                    <div class="listimgcontent">
                                    {item.productCommentImages.map((item, index)=>{
                                        return<img src={item.linkImage}/>
                                    })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        })}
                    </div>
    
                    {token != null && (
                        <div class="col-sm-12 col-12" id="mycomment">
                        <div class="liststar" id="liststar">
                            <span onClick={()=>loadStar(0)} class="fa fa-star checkedstar"></span>
                            <span onClick={()=>loadStar(1)} class="fa fa-star checkedstar"></span>
                            <span onClick={()=>loadStar(2)} class="fa fa-star checkedstar"></span>
                            <span onClick={()=>loadStar(3)} class="fa fa-star checkedstar"></span>
                            <span onClick={()=>loadStar(4)} class="fa fa-star checkedstar"></span>
                        </div>
    
                        <label id="titlerep" class="lb-chon-danhmuc">Bình luận của bạn</label>
                        <textarea id="noidungbl" class="form-control"></textarea>
                        <div onClick={()=>openChooseFile()} class="divchooseimg">
                            <span id="slfile">Đính kèm hình ảnh (chọn tối đa 3 hình)</span>
                            <span id="errorquan">Chỉ được chọn tối đa 3 ảnh</span>
                            <input onChange={()=>setFile()} type="file" id="choosefilecmt" multiple/>
                        </div>
                        <div id="loading">
                            <div class="bar1 bar"></div>
                        </div><br/>
                        <button onClick={()=>saveComment()} class="btn btn-primary form-control">Binh luận</button>
                    </div>
                    )}
                </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div className=''>
                    <h5>Sản phẩm liên quan</h5>
                    <div className='row'>
                    {productLq.map((item, index)=>{
                        return <div className='col-6'>
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
                </div>
            </div>
           </div>
        </div>
        </>
    );
}

export default PublicDetailProduct;
