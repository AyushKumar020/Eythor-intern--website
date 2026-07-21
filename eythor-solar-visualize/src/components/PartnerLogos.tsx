import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { Autoplay, FreeMode } from 'swiper/modules';

interface Partner {
  name: string;
  logo: string;
}

interface PartnerLogosProps {
  partners: Partner[];
}

const PartnerLogos: React.FC<PartnerLogosProps> = ({ partners }) => {
  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="container mx-auto">
        <h3 className="text-center text-xl font-heading font-semibold mb-8">Our Partners</h3>
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={30}
          slidesPerView="auto"
          freeMode={true}
          speed={3500}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          grabCursor={true}
        >
          {partners.concat(partners).map((partner, index) => (
            <SwiperSlide
              key={index}
              className="!w-[200px] flex items-center justify-center"
            >
              <div className="p-4 glass-effect rounded-lg w-full h-[140px] flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-[100px] max-w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PartnerLogos;
