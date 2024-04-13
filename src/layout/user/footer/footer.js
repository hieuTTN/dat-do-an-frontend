import logofooter from '../../../assest/images/footer.png'

function footer(){
    return(
        <div id='footer'>
          <footer class="text-center text-lg-start text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block"></div>
      <div>
        <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
      </div>
    </section>
    <section class="">
      <div class=" text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-2 col-lg-2 col-xl-3 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">HỖ TRỢ KHÁCH HÀNG 24/7</h6>
            <p><a href="#!" class="text-reset">Điều khoản dịch vụ</a></p>
            <p><a href="#!" class="text-reset">Liên hệ hỗ trợ</a></p>
            <p><a href="#!" class="text-reset">Câu hỏi thường gặp</a></p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">DỊCH VỤ CUNG CẤP</h6>
            <p><a href="#!" class="text-reset">Nhà</a></p>
            <p><a href="#!" class="text-reset">Căn hộ</a></p>
            <p><a href="#!" class="text-reset">Resort</a></p>
            <p><a href="#!" class="text-reset">Biệt thự</a></p>
            <p><a href="#!" class="text-reset">Nhà khách</a></p>
          </div>
          <div class="col-md-4 col-lg-4 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">VỀ CHÚNG TÔI</h6>
            <div>
                Mường Thanh Luxury là phân khúc khách sạn hạng sang cao cấp nhất của Mường Thanh, nằm ở các thành phố lớn và trung tâm du lịch nổi tiếng trong nước và quốc tế. Quy mô lớn và đẳng cấp khác biệt, Mường Thanh Luxury mang đến cho khách hàng không gian nghỉ dưỡng tuyệt vời mang đậm giá trị Việt đến từ dịch vụ tận tâm và văn hóa ẩm thực bản địa độc đáo.
            </div>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <img src={logofooter} class="imgfooter" />
          </div>
        </div>
      </div>
    </section>
</footer>

        </div>
    );
}

export default footer;