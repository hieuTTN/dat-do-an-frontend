import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,getMethodPostByToken,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';


var token = localStorage.getItem("token");

var imgbanner = '';
async function saveCategory(event) {
    event.preventDefault();
    var anh = await uploadSingleFile(document.getElementById("fileimage"))
    if(anh != null){
        imgbanner = anh;
    }
    const payload = {
        id: event.target.elements.idcate.value,
        name: event.target.elements.catename.value,
        image: imgbanner,
    };
    const res = await fetch('http://localhost:8080/api/category/admin/create', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if(res.status < 300){
        toast.success('Thành công!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
    if (res.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
};


const AdminInvoice = ()=>{
    const [items, setItems] = useState([]);
    const [statusInvoice, setStatusInvoice] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    const [invoice, setInvoice] = useState(null);

    useEffect(()=>{
        const getInvoice = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/invoice/admin/find-all");
            var list = await response.json();
            setItems(list)
        };
        getInvoice();
        const getStatusInvoice = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/invoice/admin/all-status");
            var list = await response.json();
            setStatusInvoice(list)
        };
        getStatusInvoice();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });

    async function filterInvoice(){
        $('#example').DataTable().destroy();
        var url = 'http://localhost:8080/api/invoice/admin/find-all?oke=1';
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        var type = document.getElementById("type").value
        var trangthai = document.getElementById("trangthai").value
        if (start != "" && end != "") {
            url += '&from=' + start + '&to=' + end;
        }
        if (type != -1) {
            url += '&paytype=' + type;
        }
        if (trangthai != -1) {
            url += '&status=' + trangthai
        }
        var response = await getMethodByToken(url);
        var list = await response.json();
        setItems(list)
    }


    const getInvoiceDetail = async(item) =>{
        var response = await getMethodByToken('http://localhost:8080/api/invoice-detail/admin/find-by-invoice?idInvoice='+item.id)
        var list = await response.json();
        setItemDetail(list);
        document.getElementById("trangthaiupdate").value = item.statusInvoice
    };
    const setValueInp = async(item) =>{
        setInvoice(item)
        document.getElementById("trangthaiupdate").value = item.statusInvoice
    };

    async function updateStatus() {
        var trangthai = document.getElementById("trangthaiupdate").value
        const res = await getMethodPostByToken('http://localhost:8080/api/invoice/admin/update-status?idInvoice=' + invoice.id + '&status=' + trangthai);
        if (res.status < 300) {
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            var response = await getMethodByToken("http://localhost:8080/api/invoice/admin/find-all");
            var list = await response.json();
            setItems(list)
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
            <div class="row">
                <div class="col-md-2">
                    <label>Từ ngày</label>
                    <input id="start" type="date" class="form-control"/>
                </div>
                <div class="col-md-2">
                    <label>Đến ngày</label>
                    <input id="end" type="date" class="form-control"/>
                </div>
                <div class="col-md-3">
                    <label>Loại thanh toán</label>
                    <select id="type" class="form-control">
                        <option value="-1">--- Tất cả ---</option>
                        <option value="MOMO">Thanh toán bằng momo</option>
                        <option value="COD">Thanh toán khi nhận hàng</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label>Trạng thái đơn hàng</label>
                    <select class="form-control" id="trangthai">
                        <option value="-1">--- Tất cả ---</option>
                        {statusInvoice.map((item=>{
                            return <option value={item}>{item}</option>
                        }))}
                    </select>
                </div>
                <div class="col-md-2">
                    <br/>
                    <button onClick={()=>filterInvoice()} class="btn btn-danger form-control"><i class="fa fa-filter"></i> Lọc</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đơn hàng</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Địa chỉ</th>
                                <th>Liên hệ</th>
                                <th>Giá trị đơn hàng</th>
                                <th>Trạng thái thanh toán</th>
                                <th>Trạng thái vận chuyển</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.address}</td>
                                    <td>{item.receiverName}, sđt: {item.phone}</td>
                                    <td>{formatMoney(item.totalAmount)}</td>
                                    <td>{item.payType}</td>
                                    <td>{item.statusInvoice}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>setValueInp(item)} data-bs-toggle="modal" data-bs-target="#capnhatdonhang" class="fa fa-edit iconaction"></i>
                                        <i onClick={()=>getInvoiceDetail(item)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
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

    <div class="modal fade" id="capnhatdonhang" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Cập nhật trạng thái đơn hàng</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <select class="form-control" id="trangthaiupdate">
                    {statusInvoice.map((item=>{
                        return <option value={item}>{item}</option>
                    }))}
                    </select><br/><br/>
                    <button onClick={()=>updateStatus()} class="btn btn-primary form-control action-btn">Cập nhật</button>
                </div>
            </div>
        </div>
    </div>
</>
    );
}

export default AdminInvoice;