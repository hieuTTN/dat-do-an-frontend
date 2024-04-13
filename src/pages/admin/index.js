import lich from '../../assest/images/lich.png'
import { useState, useEffect } from 'react'
import {getMethodByToken} from '../../services/request'
import {formatMoney} from '../../services/money'



const HomeAdmin = ()=>{
    const [doanhthu, setDoanhThu] = useState(null);
    const [quantri, setQt] = useState(null);
    const [sophong, setSoPhong] = useState(null);
    useEffect(()=>{
        // const getDoanhThu = async() =>{
        //     var response = await getMethodByToken("http://localhost:8080/api/statistic/admin/revenue-this-month");
        //     var result = await response.text();
        //     setDoanhThu(result)
        // };
        // getDoanhThu();
    }, []);

  
    return(
       <></>
    );
}
export default HomeAdmin;