import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {handleLogin} from '../../services/auth';


function login(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divimglogin">
                    <img src={logologin} alt=""/>
                </div>
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Nhập</p>
                    <form onSubmit={handleLogin} autocomplete="off">
                        <label class="lbform">Tên tài khoản</label>
                        <input required name='username' id="username" class="inputlogin"/>
                        <label class="lbform">Mật khẩu</label>
                        <input required name='password' type="password" id="password" class="inputlogin"/>
                        <button class="btndangnhap">ĐĂNG NHẬP</button>
                        <button type="button"  onClick={()=>{window.location.href = 'regis'}} class="btndangky">ĐĂNG KÝ</button>
                    </form>
                    <a href="forgot" class="lbquenmk">Quên mật khẩu ?</a>
                </div>
            </div>
        </div>
    </div>
    );
}
export default login;