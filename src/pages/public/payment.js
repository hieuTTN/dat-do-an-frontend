import Header from '../../layout/user/header/header'
import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import indeximg from '../../assest/images/index1.jpg'
import momo from '../../assest/images/momo.webp'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.jpg'
import { json } from 'react-router-dom'
import {toast } from 'react-toastify';
import $ from 'jquery'; 
import {getMethod,getMethodByToken,getMethodDeleteByToken, getMethodPostByToken, getMethodPostPayload} from '../../services/request'

var token = localStorage.getItem("token");

async function createInvoice() {
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");

    var obj = JSON.parse(window.localStorage.getItem("orderinfor"));
    obj.requestIdMomo = requestId
    obj.orderIdMomo = orderId

    var res = await getMethodPostPayload('http://localhost:8080/api/invoice/user/create', obj)
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == 417) {
        var result = await res.json();
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }

}

    // $( document ).ready(function() {
    //     createInvoice();
    // });

function PublicPayment(){
    useEffect(()=>{
        createInvoice();
    }, []);

    return(
        <div class="contentmain"><br/><br/><br/>
        <div>
            <div id="thanhcong">
                <h3>Đặt thành công</h3>
                <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
                <p>Hãy kiểm tra thông tin đơn đặt hàng của bạn trong lịch sử đặt hàng</p>
                <a href="account" class="btn btn-danger">Xem lịch sử đặt hàng</a>
            </div>

            <div id="thatbai">
                <h3>Thông báo</h3>
                <p id="errormess">Bạn chưa hoàn thành thanh toán.</p>
                <p>Quay về <a href="/">trang chủ</a></p>
            </div>
        </div>
    </div> 
    );
}

export default PublicPayment;
