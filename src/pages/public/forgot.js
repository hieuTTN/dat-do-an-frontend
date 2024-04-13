import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {handleLogin} from '../../services/auth';
import Swal from 'sweetalert2'

function PublicForgot(){

    function backToLogin(){
        window.location.href = 'login'
    }

    async function forgorPassword(event) {
        event.preventDefault();
        var email = document.getElementById("email").value
        var url = 'http://localhost:8080/api/forgot-password?email=' + email
        const res = await fetch(url, {
            method: 'POST'
        });
        if (res.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "mật khẩu mới đã được gửi về email của bạn",
                preConfirm: () => {
                    window.location.replace("login")
                }
            });
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
    }

    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divimglogin">
                    <img src={logologin} alt=""/>
                </div>
                <div class="divctlogin">
                    <p class="labeldangnhap">Quên Mật khẩu</p>
                    <form onSubmit={forgorPassword} autocomplete="off">
                        <label class="lbform">Nhập email của bạn</label>
                        <input name='email' id="email" class="inputlogin"/>
                        <button class="btndangnhap">XÁC NHẬN</button>
                        <button type="button" onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}
export default PublicForgot;