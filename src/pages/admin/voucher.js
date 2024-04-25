import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';

var token = localStorage.getItem("token");



const AdminVoucher = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getVoucher= async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/voucher/admin/findAll-list');
            var list = await response.json();
            setItems(list)
        };
        getVoucher();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteVoucher(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa voucher này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/voucher/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethodByToken('http://localhost:8080/api/voucher/admin/findAll-list');
            var list = await res.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const locVoucher= async() =>{
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        var url = 'http://localhost:8080/api/voucher/admin/findAll-list'
        if (start != null && start != "" && end != null && end != "" && start != 'null' && end != 'null') {
            url += '?start=' + start + '&end=' + end
        }
        var response = await getMethodByToken(url);
        var list = await response.json();
        console.log(list);
        setItems(list)
    };


    return (
        <>
            <div class="row">
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form">Từ ngày</label>
                    <input id="start" type="date" class="form-control"/>
                </div>
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form">Đến ngày</label>
                    <input id="end" type="date" class="form-control"/>
                </div>
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <button onClick={()=>locVoucher()} class="btn btn-success"><i class="fa fa-filter"></i> Lọc</button>
                </div>
                <div class="col-md-3">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <a href="addvoucher" class="btn btn-success"><i class="fa fa-plus"></i> Thêm voucher</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách voucher</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Mã</th>
                                <th>Tên voucher</th>
                                <th>Đơn hàng tối thiểu</th>
                                <th>Giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.minAmount)}</td>
                                    <td>{formatMoney(item.discount)}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                    <td>{item.block == true?'Đã khóa':'Đang hoạt động'}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteVoucher(item.id)} class="fa fa-trash iconaction"></i>
                                        <a href={"addvoucher?id="+item.id}><i class="fa fa-edit iconaction"></i></a>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default AdminVoucher;