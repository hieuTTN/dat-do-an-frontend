import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import Swal from 'sweetalert2'
// import {handleLogin} from '../../services/auth';

async function handleRegis(event) {
    event.preventDefault();
    if(event.target.elements.password.value != event.target.elements.repassword.value){
        toast.error("Mật khẩu không trùng khớp");
        return;
    }
    const payload = {
        fullname: event.target.elements.fullname.value,
        email: event.target.elements.email.value,
        phone: event.target.elements.phone.value,
        password: event.target.elements.password.value
    };
    const res = await fetch('http://localhost:8080/api/regis', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Thông báo",
            text: "đăng ký thành công! hãy check email của bạn!",
            preConfirm: () => {
                window.location.href = 'confirm?email=' + result.email
            }
        });
    }
};

function regis(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divimglogin">
                    <img src={logologin} class="imgbacklogin"/>
                </div>
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Ký</p>
                    <form  onSubmit={handleRegis} autocomplete="off">
                        <label class="lbform">Họ tên</label>
                        <input required name='fullname' id="fullname" class="inputlogin"/>
                        <label class="lbform">Email</label>
                        <input required name='email' id="email" class="inputlogin"/>
                        <label class="lbform">Số điện thoại</label>
                        <input required name='phone' id="phone" class="inputlogin"/>
                        <label class="lbform">Mật khẩu</label>
                        <input required name='password' type="password" id="password" class="inputlogin"/>
                        <label class="lbform">Nhập lại mật khẩu</label>
                        <input required name='repassword' type="password" id="repassword" class="inputlogin"/>
                        <button class="btndangnhap">ĐĂNG KÝ</button>
                        <button type="button" onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

        
    );
}
export default regis;