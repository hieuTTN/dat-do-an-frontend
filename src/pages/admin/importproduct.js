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


const AdminImportProduct = ()=>{
    const [items, setItems] = useState([]);
    const [products, setProduct] = useState([]);

    useEffect(()=>{
        const getImportProduct = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/import-product/admin/findAll");
            var list = await response.json();
            setItems(list)
        };
        getImportProduct();
        const getProduct = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/product/public/findAll-list");
            var list = await response.json();
            setProduct(list)
        };
        getProduct();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteImportProduct(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa đơn nhập này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/import-product/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethodByToken('http://localhost:8080/api/import-product/admin/findAll');
            var list = await res.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }


    const filterImportProduct = async() =>{
        var idproduct = document.getElementById("sanpham").value;
        var from = document.getElementById("start").value;
        var to = document.getElementById("end").value;
        var url = "http://localhost:8080/api/import-product/admin/findAll?sse=0"
        if(idproduct != -1){
            url += `&idproduct=`+idproduct
        }
        if(from != "" && to != ""){
            url += `&from=`+from+"&to="+to
        }
        var response = await getMethodByToken(url);
        var list = await response.json();
        setItems(list)
    };

    return (
        <>
            <div class="row">
                <div class="col-md-2">
                    <label class="lb-form">Từ ngày</label>
                    <input id="start" type="date" class="form-control"/>
                </div>
                <div class="col-md-2">
                    <label class="lb-form">Đến ngày</label>
                    <input id="end" type="date" class="form-control"/>
                </div>
                <div class="col-md-3">
                    <label class="lb-form">Chọn sản phẩm</label>
                    <select id="sanpham" class="form-control">
                        <option value={-1}>Tất cả sản phẩm</option>
                        {products.map((item=>{
                                return <option value={item.id}>{item.name}</option>
                            }))}
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <button onClick={()=>filterImportProduct()} class="btn btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button>
                </div>
                <div class="col-md-2">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <a href='addimportproduct' class="btn btn-primary form-control"><i class="fa fa-plus"></i> Thêm đơn nhập</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đơn nhập hàng</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>sản phẩm</th>
                                <th>Số lượng nhập</th>
                                <th>giá nhập</th>
                                <th>Ngày nhập</th>
                                <th>Thông tin</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return <tr>
                                    <td>{item.product.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatMoney(item.importPrice)}</td>
                                    <td>{item.importTime}, {item.importDate}</td>
                                    <td dangerouslySetInnerHTML={{__html:item.description}}></td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteImportProduct(item.id)} class="fa fa-trash iconaction"></i>
                                        <a href={"addimportproduct?id="+item.id}><i class="fa fa-edit iconaction"></i></a>
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

export default AdminImportProduct;