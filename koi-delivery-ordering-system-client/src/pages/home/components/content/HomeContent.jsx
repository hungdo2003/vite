import "./content.scss";
import { useEffect, useState } from "react";
import { getAllNews } from "../../../../utils/axios/news";
import { getFileByFileId } from "../../../../utils/axios/file";
import Paragraph from "antd/es/typography/Paragraph";
import { useNavigate } from "react-router-dom";
import img1 from "../../../../assets/img1.jpg";
import img2 from "../../../../assets/img2.jpg";
import img3 from "../../../../assets/img3.jpg";
import img4 from "../../../../assets/img4.jpg";

function HomeContent() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const fetchNews = async () => {
    try {
      const response = await getAllNews();

      if (response && response.length > 0) {
        const fileIds = response.map((newsItem) => newsItem.file.id);

        if (fileIds.length > 0) {
          const filePromises = fileIds.map(async (fileId) => {
            const fileResponse = await getFileByFileId(fileId);
            return URL.createObjectURL(fileResponse);
          });

          const imageUrls = await Promise.all(filePromises);

          const newsWithImages = response.map((newsItem, index) => ({
            ...newsItem,
            imageUrl: imageUrls[index],
          }));

          setNews(newsWithImages);
        }
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  const handleNewsClick = (newsItem) => {
    navigate(`/news/${newsItem.id}`, { state: newsItem });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
    navigate("/news");
  };

  // eslint-disable-next-line no-unused-vars
  const newsData = [
    {
      category: "ECOMMERCE",
      title: "How to Use the Ezbuy Japan App to Send Goods…",
      description:
        "Are you living in Japan and looking to send goods abroad? With just a few simple steps, you can easily manage cross-border shipping using the Ezbuy...",
      imageUrl:
        "https://img.meta.com.vn/Data/image/2020/12/25/ho-ca-koi-dep-1.jpg",
      author: "Macy",
      date: "2024-08-01",
    },
    {
      category: "B2B Trading",
      title: "B2B Purchase Negotiation Service from Japan for…",
      description:
        "For international enterprises, importing goods from Japan in large quantities is an urgent and frequent need. However, this process comes with many challeng...",
      imageUrl:
        "https://viewgarden.vn/wp-content/uploads/2021/05/Ca-koi-dep.jpg",
      author: "Macy",
      date: "2024-04-09",
    },
    {
      category: "Shipping",
      title: "Professional Japanese White Pine Shipping Service to The…",
      description:
        "Japanese pine stands out as one of the most sought-after trees among plant enthusiasts due to its imposing and robust beauty. However, acquiring these...",
      imageUrl:
        "https://img2.thuthuatphanmem.vn/uploads/2019/03/07/hinh-anh-ca-koi-buom-dep_111106426.png",
      author: "Macy",
      date: "2024-04-06",
    },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Real-time order tracking",
      description:
        "View, track and process your orders and stay up-to-date on high-tech software at all times.",
    },
    {
      icon: "🗾",
      title: "Risk-freely expedite Japanese market entry",
      description:
        "Easily enter into Japanese eCommerce market and boost business with A-to-Z support.",
    },
    {
      icon: "🚀",
      title: "Next-day delivery with global presence",
      description:
        "Ship to over 220 countries and territories with ease, using standard and expedited shipping options.",
    },
    {
      icon: "📝",
      title: "Smooth & safe customs clearance",
      description:
        "Digitalize customs clearance to avoid errors and make the entire customs process more secure, transparent and visible at all steps.",
    },
    {
      icon: "✈️",
      title: "Door-to-door Air freight",
      description:
        "Guarantee attractive prices and consistently high-service standards with long-standing partnerships & many well-known airlines.",
    },
  ];
  return (
    <>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h2>
              WE ARE COMMITTED TO REMOVING BARRIERS OF CROSS-BORDER E-COMMERCE
            </h2>
            <p>
              With the vision of becoming the leading cross-border eCommerce
              enabler for both sellers and buyers, DELIVERKIN strives to provide
              comprehensive cross-border eCommerce solutions, powered by
              world-class technology, outstanding expertise, and a passion for
              serving clients to help businesses unlock growth potential.
            </p>
            <div className="banner-stats">
              <div className="stat-item">
                <h2>4.000+</h2>
                <p>New Users</p>
              </div>
              <div className="stat-item">
                <h2>1.900+</h2>
                <p>Customers order</p>
              </div>
              <div className="stat-item">
                <h2>4.000+</h2>
                <p>Orders</p>
              </div>
              <div className="stat-item">
                <h2>30+</h2>
                <p>Tons of goods</p>
              </div>
            </div>
            <button className="contact-button">Contact Sales</button>
          </div>
          <div className="banner-image">
            <img
              src={img1}
              alt="delivery"
            />
          </div>
        </div>

        <div className="why-work-with-us">
          <h2>WHY WORK WITH DELIVERKIN?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="services-section">
          <h2 className="section-title">SERVICES</h2>

          {/* Khung 1: Ảnh bên phải, chữ bên trái */}
          <div className="service-container">
            <div className="service-item">
              <div className="service-content">
                <div className="service-number">01</div>
                <h3 className="service-title">We are KoiShip</h3>
                <p className="service-description">
                  Welcome to KoiShip, the trusted name in koi fish shipping.
                  Whether you are a seasoned collector or a first-time buyer, we
                  ensure your prized koi fish are transported with the utmost
                  care. Our specially designed shipping methods guarantee safe
                  and timely delivery across the country, with proper
                  temperature control and water quality checks throughout the
                  journey. At KoiShip, we understand the value of your koi, and
                  we are committed to delivering them healthy, happy, and
                  stress-free, right to your doorstep.
                </p>

              </div>
              <div className="service-image">
                <img
                  src={img1}
                  alt="Service"
                />
              </div>
            </div>

            {/* Khung 2: Ảnh bên trái, chữ bên phải */}
            <div className="service-item reverse-layout">
              <div className="service-image">
                <img
                  src={img2}
                  alt="Service 2"
                />
              </div>
              <div className="service-content">
                <div className="service-number">02</div>
                <h3 className="service-title">Cross-border Shipping</h3>
                <p className="service-description">
                  KoiShip Japan offers international delivery by air and sea
                  from Japan to over 220 countries. We provide various shipping
                  methods and optional services to ensure your packages arrive
                  safely and efficiently.
                </p>

              </div>
            </div>

            {/* Khung 3: Ảnh bên phải, chữ bên trái */}
            <div className="service-item">
              <div className="service-content">
                <div className="service-number">03</div>
                <h3 className="service-title">Cross-border eCommerce</h3>
                <p className="service-description">
                  Say goodbye to the need for Japanese language skills, multiple
                  buying accounts or complex payment methods when shopping from
                  various Japanese eCommerce websites. Break free from
                  geographical barriers and unlock a world of potential markets
                  through our comprehensive international delivery solution.
                </p>

              </div>
              <div className="service-image">
                <img
                  src={img3}
                  alt="Service"
                />
              </div>
            </div>

            {/* Khung 4: Ảnh bên trái, chữ bên phải */}
            <div className="service-item reverse-layout">
              <div className="service-image">
                <img
                  src={img4}
                  alt="Service 2"
                />
              </div>
              <div className="service-content">
                <div className="service-number">04</div>
                <h3 className="service-title">Cross-border Shipping</h3>
                <p className="service-description">
                  DELIVERKIN offers international delivery by air and sea from
                  Japan to over 220 countries. We provide various shipping
                  methods and optional services to ensure your packages arrive
                  safely and efficiently.
                </p>

              </div>
            </div>
          </div>
        </div>

        <div className="news-container">
          <h2>LATEST NEWS</h2>
          <p className="description">
            When you visit our blog, you will explore the latest insights and
            articles on eCommerce and logistics, tailored for businesses of all
            sizes.
          </p>
          <div className="news-container">
            <div className="news-grid">
              {news.slice(0, visibleCount).map((newsItem, index) => (
                <div key={index} className="news-item">
                  {/* Chuyển logic onClick sang phần tử ảnh */}
                  <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="news-image"
                    style={{ cursor: "pointer" }} // Thêm pointer để người dùng biết ảnh có thể được click
                    onClick={() => handleNewsClick(newsItem)} // Khi ấn vào ảnh thì chuyển sang trang detail
                  />
                  <div className="news-content">
                    <h3 className="news-title">{newsItem.title}</h3>

                    <Paragraph
                      ellipsis={{
                        rows: 3,
                        expandable: false,
                        symbol: "...",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: newsItem.description,
                        }}
                      />
                    </Paragraph>

                    <div className="news-footer">
                      <span className="news-author">
                        {newsItem.createdBy.username}
                      </span>
                      <span className="news-date">
                        {new Date(newsItem.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-more">
              <button onClick={handleViewMore}>View more →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeContent;
