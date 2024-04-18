import lich from '../../assest/images/lich.png'
import { useState, useEffect } from 'react'
import {getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'



const HomeAdmin = ()=>{
    const [doanhthu, setDoanhThu] = useState(0);
    const [quantri, setQt] = useState(null);
    const [doanhthuHomNay, setDoanhThuHomNay] = useState(0);
    const [donHoanThanhHomNay, setDonHoanThanhHomNay] = useState(0);
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getThongKe = async() =>{
            var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/revenue-this-month");
            var result = await response.text();
            setDoanhThu(result)

            var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/revenue-today");
            var result = await response.text();
            setDoanhThuHomNay(result)

            var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/number-admin");
            var result = await response.text();
            setQt(result)

            var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/number-invoice-today-finish");
            var result = await response.text();
            setDonHoanThanhHomNay(result)
        };
        getThongKe();

        const getProductBanChay= async() =>{
            var response = await getMethodByToken('http://localhost:8080/api/product/public/san-pham-ban-chay');
            var list = await response.json();
            setItems(list)
        };
        getProductBanChay();

        function getMauSac(){
            var arr = ['#4e73df','#1cc88a','#36b9cc','#eb9534','#ed00c6','#edd500']
            var act = document.getElementsByClassName("border-left");
            var lbcard = document.getElementsByClassName("lbcard");
            for(var i=0; i<act.length; i++){
                act[i].style.borderLeft = '.25rem solid '+arr[i]
            }
            for(var i=0; i<lbcard.length; i++){
                lbcard[i].style.color = arr[i]
            }
        }
        getMauSac();
    }, []);

  
    return(
       <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu tháng này</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhthu)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu hôm nay</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhthuHomNay)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Số lượng quản trị</span>
                    <span className='solieudoanhthu'>{quantri}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Đơn hoàn thành hôm nay</span>
                    <span className='solieudoanhthu'>{donHoanThanhHomNay}</span>
                </div>
            </div>
        </div>

        <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách sản phẩm bán chạy</span>
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
                                <th>Hạn sử dụng</th>
                                <th>Số lượng bán</th>
                                <th>Danh mục</th>
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
                                    <td>{item.expiry}</td>
                                    <td>{item.quantitySold}</td>
                                    <td>{item.category.name}</td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

       </>
    );
}
export default HomeAdmin;