import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
import { getAllNews, deleteNewsById } from "../../../utils/axios/news"; // Import delete function
import { getFileByFileId } from "../../../utils/axios/file";
import { toast } from "react-toastify"; // Import toast for notifications
import "./AllNews.scss";
import { jwtDecode } from "jwt-decode"; // Correct the import
import Header from "../../Layout/SalesStaffLayout/components/Header/Header";
import dateTimeConvert from "../../../components/utils";

function AllNews() {
  const [news, setNews] = useState([]);
  const [salesStaffId, setSalesStaffId] = useState(null); // Initialize as null
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  // Fetch news data with image
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

  // Decode token to get the sales staff ID
  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const staffId = decoded.sub.split("_")[0];
        setSalesStaffId(staffId);
      }
    };

    decodeToken();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle "View More" news
  const handleViewDetail = (newsItem) => {
    navigate(`/news/${newsItem.id}`, {
      state: newsItem, // Pass state if necessary
    });
  };

  // Handle Delete News
  const handleDeleteNews = async (newsId) => {
    try {
      await deleteNewsById(newsId);
      toast.success("News deleted successfully!");
      fetchNews(); // Refresh news list
    } catch (error) {
      toast.error("Error deleting news.");
      console.error("Error deleting news:", error);
    }
  };

  return (
    <>
      <Header />
      <div>
        <div className="all-news-container">
          <h1>All News</h1>
          <div className="news-grid">
            {news.map((newsItem, index) => (
              <div key={index} className="news-item">
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-title">{newsItem.title}</h3>
                  <Paragraph ellipsis={{ rows: 3 }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: newsItem.description }}
                    />
                  </Paragraph>
                  <div>
                    <span className="news-date">
                      {dateTimeConvert(newsItem.createdDate)}
                    </span>

                  </div>
                  <div className="card-actions">
                    <div className="detail-button">
                      <button onClick={() => handleViewDetail(newsItem)}>
                        View detail
                      </button>
                    </div>

                    {/* Show "Delete" button only if salesStaffId === 's' */}
                    <div className="delete-button">
                      {salesStaffId === "S" && (
                        <button onClick={() => handleDeleteNews(newsItem.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="back-button">
            <button onClick={handleBackClick}>← Go back</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllNews;
