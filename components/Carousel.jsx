import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items }) => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Slider {...carouselSettings}>
        {items.map((item, index) => (
          <div key={index}>
            <div
              className="slick-art"
              style={{
                position: "relative",
                height: "300px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <img
                src={item.imgSrc}
                alt={item.text || "Image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  color: "white",
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                  padding: "10px",
                  minWidth: "100%",
                }}
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <strong style={{ display: "block", fontSize: "16px" }}>
                    {item.source}
                  </strong>
                  <h3 style={{ margin: "5px 0" }}>{item.text}</h3>
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default React.memo(Carousel, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items);
});
