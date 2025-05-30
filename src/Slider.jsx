import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Slider = () => {
    return (
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 3000 }}
        loop={true}
        style={{height: "450px", borderRadius: 10 }}
      >
        <SwiperSlide>
          <img src="../public/section_banner_1.jpg" alt="Banner 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../public/banner_children_products.png" alt="Banner 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../public/8452091.jpg" alt="Banner 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </SwiperSlide>
      </Swiper>
    );
  };
  
  export default Slider;
  