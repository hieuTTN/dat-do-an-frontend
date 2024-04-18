import {getMethod, getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';

function PublicKiemTraDon(){
    const [items, setItems] = useState([]);
    useEffect(()=>{
    }, []);

    const getInvoice = async() =>{
        var id = document.getElementById("madonhang").value
        var phone = document.getElementById("sodienthoai").value
        var url = 'http://localhost:8080/api/invoice/public/tim-kiem-don-hang?id='+id+'&phone='+phone;
        var response = await getMethodByToken(url);
        var result = await response.json();
        if(response.status == 417){
            toast.warning(result.defaultMessage);
            return;
        }
        var li = [];
        li.push(result)
        setItems(li)
    };

    return(
        <div className='container'>
        <div class="col-sm-9 divtimdonhang">
            <p class="tintuctieude">Tìm kiếm đơn hàng của bạn</p>
            <hr/>
            <div id="noidungbaiviet">
                <div class="row">
                    <div class="col-sm-5">
                        <input type="number" id="madonhang" class="inputlogin" placeholder="Nhập mã đơn hàng của bạn"/>
                    </div>
                    <div class="col-sm-7">
                        <input id="sodienthoai" class="inputlogin" placeholder="Nhập số điện thoại"/>
                    </div>
                </div>
                <button onClick={()=>getInvoice()} class="btntracuu">Tra cứu</button>
            </div>
            <table class="table table-cart table-order" id="my-orders-table">
                <thead class="thead-default">
                    <tr>
                        <th>Mã đơn đặt</th>
                        <th>Ngày đặt</th>
                        {/* <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ nhận</th>
                        <th>Ghi chú</th> */}
                        <th>Loại thanh toán</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Tổng số tiền</th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item, index)=>{
                return <tr>
                    <td>{item.id}</td>
                    <td>{item.createdTime}, {item.createdDate}</td>
                    {/* <td>{item.receiverName}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.note}</td> */}
                    <td>{item.payType}</td>
                    <td>{item.statusInvoice}</td>
                    <td>{formatMoney(item.totalAmount)}</td>
                </tr>
                })}
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default PublicKiemTraDon;
