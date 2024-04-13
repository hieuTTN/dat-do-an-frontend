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



const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getProduct= async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/product/public/findAll-list');
            var list = await response.json();
            setItems(list)
        };
        getProduct();
    }, []);

    $( document ).ready(function() {
        if(items.length > 0){
            $('#example').DataTable();
        }
    });


    async function deleteProduct(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/product/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethodByToken('http://localhost:8080/api/product/public/findAll-list');
            var list = await res.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }


    return (
        <>
            <div class="row">
                <div class="col-md-3">
                    <a href='addproduct' class="btn btn-primary"><i class="fa fa-plus"></i> Thêm sản phẩm</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách sản phẩm</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh bìa</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá hiện tại</th>
                                <th>Giá cũ</th>
                                <th>Số lượng bán</th>
                                <th>Danh mục</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.imageBanner} className='imgadmin'/></td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{formatMoney(item.oldPrice)}</td>
                                    <td>{item.quantitySold}</td>
                                    <td>{item.category.name}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>deleteProduct(item.id)} class="fa fa-trash iconaction"></i>
                                        <a href={"addproduct?id="+item.id}><i class="fa fa-edit iconaction"></i></a>
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

export default AdminProduct;