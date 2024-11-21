package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.File;
import com.swp391team3.koi_delivery_ordering_system.model.News;
import com.swp391team3.koi_delivery_ordering_system.repository.NewsRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.SalesStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements INewsService {
    private final NewsRepository newsRepository;
    private final SalesStaffRepository salesStaffRepository;
    private final FileServiceImpl fileService;

    @Override
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    @Override
    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id);
    }

    @Override
    public void deleteNewsById(Long id) {
        newsRepository.deleteById(id);
    }

    @Override
    public boolean createNews(String title, String description, Long salesStaffId, MultipartFile file) {
        File uploadedFile = null;
        try {
            uploadedFile = fileService.uploadFileToFileSystem(file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        News news = new News();
        news.setCreatedDate(new java.util.Date());
        news.setTitle(title);
        news.setDescription(description);

        news.setCreatedBy(salesStaffRepository.findById(salesStaffId).get());
        news.setFile(uploadedFile);
        newsRepository.save(news);
        return true;
    }

//    @Override
//    public boolean updateNews(Long newsId, Long salesStaffId, String title, String description, MultipartFile file) throws IOException {
//        Optional<News> oldNews = newsRepository.findById(newsId);
//        if (oldNews.isPresent()) {
//            if (oldNews.get().getCreatedBy().getId() != salesStaffId) {
//                return false;
//            }
//            oldNews.get().setTitle(title);
//            oldNews.get().setDescription(description);
//            fileService.updateFileInFileSystem(oldNews.get().getFile().getId(), file);
//            return true;
//        }
//        return false;
//    }
//
//    @Override
//    public List<News> getNewsCreatedBySalesStaff(Long salesStaffId) {
//        return newsRepository.getNewsBySalesStaff(salesStaffId);
//    }
}
