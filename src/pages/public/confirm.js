import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import Swal from 'sweetalert2'
// import {handleLogin} from '../../services/auth';

async function handleConfirm(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = event.target.elements.maxacthuc.value
    var url = 'http://localhost:8080/api/active-account?email=' + email + '&key=' + key
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Thông báo",
            text: "Xác nhận tài khoản thành công!",
            preConfirm: () => {
                window.location.href = 'login'
            }
        });
    }
};

function confirm(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divimglogin">
                    <img src={logologin} alt=""/>
                </div>
                <div class="divctlogin">
                    <p class="labeldangnhap">Xác Nhận Đăng Ký Tài Khoản</p>
                    <form onSubmit={handleConfirm} autocomplete="off">
                        <label class="lbform">Nhập mã xác nhận của bạn</label>
                        <input name='key' id="maxacthuc" class="inputlogin"/>
                        <button class="btndangnhap">XÁC NHẬN</button>
                        <button type="button" onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}
export default confirm;