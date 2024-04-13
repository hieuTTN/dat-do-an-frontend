import styles from './header.scss';
import logo from '../../../assest/images/logo.png';
import cart from '../../../assest/images/cartheader.png';


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('/login')
}

function header (){
    var token = localStorage.getItem('token');
    var authen = <a href="login" class="pointermenu gvs menulink"><i class="fa fa-user"></i> Đăng ký/ Đăng nhập</a>
    if(token != null){
        authen = <span class="nav-item dropdown pointermenu gvs menulink">
                    <span class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-user"></i> Tài khoản</span>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="account">Tài khoản</a></li>
                        <li onClick={()=>logout()}><a class="dropdown-item" href="#">Đăng xuất</a></li>
                    </ul>
                </span>
    }
    return(
        <div id="headerweb">
        <div class="subheader">
            <div class="container subcontainerheader">
                <ul>
                    <li><a href="/gioi-thieu-cong-ty">Giới thiệu</a></li>
                    <li><a href="/san-pham-da-xem">Sản phẩm đã xem</a></li>
                    <li><a href="/trung-tam-bao-hanh">Trung tâm bảo hành</a></li>
                    <li><a href="/he-thong-cua-hang">Địa chỉ cửa hàng</a></li>
                    <li><a href="/order/check">Tra cứu đơn hàng</a></li>
                    <li><a id="login-modal" href="">Đăng nhập</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="headertop">
                <div class="row">
                    <div class="col-sm-3">
                        <img src={logo} class="logoheader" />
                    </div>
                    <div class="col-sm-6">
                        <div class="searchheader">
                            <input placeholder="Hôm nay bạn cần tìm gì?" class="inputsearchheader" />
                            <button class="btnsearchheader"><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="row">
                            <div class="col-7">
                                <a class="btnkiemtradh" href="/order/check">
                                    <span class="icon"><i class="fa fa-truck"></i></span>
                                    <span class="text">Kiểm tra đơn hàng</span>
                                </a>
                            </div>
                            <div class="col-5">
                                <div class="shoppingcartheader">
                                    <div class="shopingcontentcart">
                                        <a href=""><img src={cart} class="imgcartheader" /></a>
                                        <span class="cart-total">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );

    
}

export default header;