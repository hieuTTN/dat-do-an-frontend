import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethodByToken ,uploadSingleFile, uploadMultipleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


var token = localStorage.getItem("token");

async function saveVoucher(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var voucher = {
        "id": id,
        "code": event.target.elements.code.value,
        "name": event.target.elements.tenvc.value,
        "discount": event.target.elements.discount.value,
        "minAmount": event.target.elements.minAmount.value,
        "startDate": event.target.elements.startDate.value,
        "endDate": event.target.elements.endDate.value,
        "block": document.getElementById("lockvoucher").checked,
    }
    var url = 'http://localhost:8080/api/voucher/admin/create'
    if(id != null){
        url = 'http://localhost:8080/api/voucher/admin/update'
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(voucher)
    });
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'voucher'
            }
        });
    } else {
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
        else{
            toast.error("Thất bại");
        }
    }
}


const AdminAddVoucher = ()=>{
    const [voucher, setVoucher] = useState(null);
    useEffect(()=>{
        const getVoucher= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethodByToken('http://localhost:8080/api/voucher/admin/findById?id=' + id);
                var result = await response.json();
                setVoucher(result)
            }
        };
        getVoucher();
    }, []);

    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Thêm/ cập nhật voucher</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveVoucher} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Mã voucher</label>
                                <input defaultValue={voucher==null?'':voucher.code} name="code" type="text" class="form-control"/>
                                <label class="lb-form">Tên voucher</label>
                                <input defaultValue={voucher==null?'':voucher.name} name="tenvc" type="text" class="form-control"/>
                                <label class="lb-form">Số tiền tối thiểu</label>
                                <input defaultValue={voucher==null?'':voucher.minAmount} name="minAmount" type="number" class="form-control"/>
                                <label class="lb-form">Giảm giá</label>
                                <input defaultValue={voucher==null?'':voucher.discount} name="discount" type="text" class="form-control"/>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Từ ngày</label>
                                <input defaultValue={voucher==null?'':voucher.startDate} name="startDate" type="date" class="form-control"/>
                                <label class="lb-form">Đến ngày</label>
                                <input defaultValue={voucher==null?'':voucher.endDate} name="endDate" type="date" class="form-control"/>
                                <br/><label class="checkbox-custom">Khóa voucher 
                                    <input id="lockvoucher" type="checkbox" defaultChecked={voucher==null?'':voucher.block}/>
                                    <span class="checkmark-checkbox"></span>
                                </label><br/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminAddVoucher;