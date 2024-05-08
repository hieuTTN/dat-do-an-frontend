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
var description = '';
async function saveImportProduct(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var imp = {
        "id": id,
        "quantity": event.target.elements.soluong.value,
        "importPrice": event.target.elements.gianhap.value,
        "description": description,
        "product": {
            "id":event.target.elements.sanpham.value
        },
    }
    var url = 'http://localhost:8080/api/import-product/admin/create'
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(imp)
    });
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'importproduct'
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


const AdminAddImportProduct = ()=>{
    const editorRef = useRef(null);
    const [importProduct, setImportProduct] = useState(null);
    const [products, setProduct] = useState([]);
    useEffect(()=>{
        const getImportProduct= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethodByToken('http://localhost:8080/api/import-product/admin/findById?id=' + id);
                var result = await response.json();
                setImportProduct(result)
                description = result.description;
            }
        };
        getImportProduct();
        const getProduct = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/product/public/findAll-list");
            var list = await response.json();
            setProduct(list)
        };
        getProduct();
    }, []);
    function handleEditorChange(content, editor) {
        description = content;
    }


    
    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Thêm/ cập nhật đơn nhập</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveImportProduct} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Sản phẩm</label>
                                <select name="sanpham" type="text" class="form-control">
                                {products.map((item=>{
                                    return <option selected={importProduct==null?false:importProduct.product.id == item.id} value={item.id}>{item.name}</option>
                                }))}
                                </select>
                                <label class="lb-form">Số lượng</label>
                                <input defaultValue={importProduct==null?'':importProduct.quantity} name="soluong" type="number" class="form-control"/>
                                <label class="lb-form">giá nhập</label>
                                <input defaultValue={importProduct==null?'':importProduct.importPrice} name="gianhap" type="number" class="form-control"/>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form">Thông tin nhà cung cấp</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={importProduct==null?'':importProduct.description}
                                        value={importProduct==null?'':importProduct.description}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminAddImportProduct;