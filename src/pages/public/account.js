import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import pass from '../../assest/images/pass.svg'
import avatar from '../../assest/images/avatar.webp'
import invoice from '../../assest/images/invoice.svg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { getMethodByToken ,getMethodPostByToken,getMethodDeleteByToken,getMethodPostPayload} from '../../services/request';
import {handleChangePass} from '../../services/auth';
import { toast } from 'react-toastify'


async function checkUser(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/check-role-user';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('/login')
    }
}

function PublicAccount(){
    const [items, setItems] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    useEffect(()=>{
        checkUser();
        const getInvoice = async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/invoice/user/find-by-user')
            var list = await response.json();
            setItems(list);
          };
        getInvoice();
    }, []);
    function changeLink(e, idtab, idtabdong){
        document.getElementById(idtab).style.display = 'block';
        document.getElementById(idtabdong).style.display = 'none';
        var tabs = document.getElementsByClassName("tabdv");
        for (var i = 0; i < tabs.length; i++) {
            document.getElementsByClassName("tabdv")[i].classList.remove("activetabdv");
        }
        e.target.classList.add('activetabdv')
    }


    function loadTrangThai(name){
        if(name == "DEPOSITED"){
            return "<span class='dadatcoc'>Đã đặt cọc</span>";
        }
        if(name == "PAID"){
            return "<span class='dathanhtoan'>Đã thanh toán</span>";
        }
        if(name == "CANCELLED"){
            return "<span class='dahuy'>Đã hủy</span>";
        }
    }

    const getInvoiceDetail = async(id) =>{
        var response = await getMethodByToken('http://localhost:8080/api/invoice-detail/user/find-by-invoice?idInvoice='+id)
        var list = await response.json();
        setItemDetail(list);
      };

    const cancelInvoice = async(id) =>{
        var con = window.confirm("Xác nhận hủy đơn hàng?");
        if (con == false) {
            return;
        }
        var response = await getMethodPostByToken('http://localhost:8080/api/invoice/user/cancel-invoice?idInvoice='+id)
        if(response.status < 300){
            toast.success("Hủy thành công");
            var response = await getMethodByToken('http://localhost:8080/api/invoice/user/find-by-user')
            var list = await response.json();
            setItems(list);
        }
        else{
            toast.warning("Hủy thất bại");
        }
      };


    return(
        
        <div class="contentmain">
        <div class="row cartbds">
            <div class="col-lg-3 col-md-3 col-sm-12 col-12 collistcart">
                <div class="navleftacc">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-6 col-6 sinv">
                            <div onClick={(event)=>changeLink(event,'invoice', "changepass")} class="tabdv activetabdv">
                                <i className='fa fa-file'></i> Đơn hàng của tôi
                            </div>
                            <div onClick={(event)=>changeLink(event,'changepass','invoice')} class="tabdv">
                                <i className='fa fa-clock'></i> Đổi mật khẩu
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12 col-12 collistcart">
                <div class="navrightacc">
                    <div class="tab-content contentab">
                        <div role="tabpanel" class="tab-pane active" id="invoice">
                            <div class="headeraccount">
                                <div class="right_flex">
                                    <span class="tongdondathang" id="sldonhang">{items.length} đơn đặt</span>
                                </div>
                            </div>
                            <table class="table table-cart table-order" id="my-orders-table">
                                <thead class="thead-default">
                                    <tr>
                                        <th>Mã đơn đặt</th>
                                        <th>Ngày đặt</th>
                                        <th>Họ tên</th>
                                        <th>Số điện thoại</th>
                                        <th>Địa chỉ nhận</th>
                                        <th>Ghi chú</th>
                                        <th>Loại thanh toán</th>
                                        <th>Trạng thái đơn hàng</th>
                                        <th>Tổng số tiền</th>
                                        <th>Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {items.map((item, index)=>{
                                return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.receiverName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.note}</td>
                                    <td>{item.payType}</td>
                                    <td>{item.statusInvoice}</td>
                                    <td>{formatMoney(item.totalAmount)} {item.voucher == null?'':'-'+formatMoney(item.voucher.discount)}</td>
                                    <td>
                                    {(item.statusInvoice == "DANG_CHO_XAC_NHAN" || item.statusInvoice== "DA_XAC_NHAN") && item.payType == 'COD'?
                                    <i onClick={()=>cancelInvoice(item.id)} class="fa fa-trash huydon"></i>:''}
                                    <i onClick={()=>getInvoiceDetail(item.id)} data-bs-toggle="modal" data-bs-target="#modaldeail" className='fa fa-eye chitietdhic'></i>
                                    </td>
                                </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="changepass">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 passacc">
                                <form onSubmit={handleChangePass}>
                                    <label class="lbacc">Mật khẩu hiện tại *</label>
                                    <input name="currentpass" type="password" class="form-control"/>
                                    <label class="lbacc">Mật khẩu mới *</label>
                                    <input name="newpass" type="password" class="form-control"/>
                                    <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                    <input name="renewpass" type="password" class="form-control"/>
                                    <br/>
                                    <button type="submit" class="btn btn-primary">LƯU</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết đơn hàng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá tiền</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                        {itemDetail.map((item, index)=>{
                            return <tr>
                            <td><img src={item.product.imageBanner} className='imgdetailhd'/></td>
                            <td>{item.product.name}</td>
                            <td>{formatMoney(item.price)}</td>
                            <td>{item.quantity}</td>
                        </tr>
                        })}
                        </tbody>
                    </table><br/><br/>
                </div>
            </div>
        </div>
        </div>
    </div>
    );
}

export default PublicAccount;
