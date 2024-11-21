package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.News;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface INewsService {
    List<News> getAllNews();
    Optional<News> getNewsById(Long id);
    void deleteNewsById(Long id);
    public boolean createNews(String title, String description, Long salesStaffId, MultipartFile file);
//    public boolean updateNews(Long salesStaffId, Long newsId, String title, String description, MultipartFile file) throws IOException;
//    public List<News> getNewsCreatedBySalesStaff(Long salesStaffId);
}
