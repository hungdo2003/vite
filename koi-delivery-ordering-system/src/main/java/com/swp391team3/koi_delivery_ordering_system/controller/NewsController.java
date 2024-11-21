package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.model.News;
import com.swp391team3.koi_delivery_ordering_system.service.INewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final INewsService newsService;

//    @PreAuthorize("hasAnyRole()")
    @GetMapping("/getAllNews")
    public ResponseEntity<?> getAllNews() {
        List<News> newsList = newsService.getAllNews();
        return ResponseEntity.ok(newsList);
    }

//    @PreAuthorize("hasAnyRole()")
    @GetMapping("/getNewsById/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PreAuthorize("hasAuthority('SalesStaff')")
    @DeleteMapping("/deleteNewsById/{id}")
    public void deleteNewsById(@PathVariable Long id) {
        newsService.deleteNewsById(id);
    }

    @PreAuthorize("hasAuthority('SalesStaff')")
    @PostMapping(value = "/createNews/{salesStaffId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNews(@PathVariable(name = "salesStaffId") Long salesStaffId,
                                        @RequestParam(name = "title") String title,
                                        @RequestParam(name = "description") String description,
                                        @RequestParam(name = "image") MultipartFile file) {
        boolean news = newsService.createNews(title, description, salesStaffId, file);

        return ResponseEntity.ok(news);
    }

//    @PreAuthorize("hasAuthority('SalesStaff')")
//    @PutMapping(value = "/update-news", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> updateNews(@RequestParam(name = "newsId") Long newsId,
//                                        @RequestParam(name = "salesStaffId") Long salesStaffId,
//                                        @RequestParam(name = "title") String title,
//                                        @RequestParam(name = "description") String description,
//                                        @RequestParam(name = "image") MultipartFile file) throws IOException {
//        boolean news = newsService.updateNews(newsId, salesStaffId, title, description, file);
//
//        return ResponseEntity.ok(news);
//    }
//
//    @PreAuthorize("hasAuthority('SalesStaff')")
//    @GetMapping("/get-news-by-sales-staff/{salesStaffId}")
//    public ResponseEntity<?> getNewsBySalesStaffId(@PathVariable Long salesStaffId) {
//        return ResponseEntity.ok(newsService.getNewsCreatedBySalesStaff(salesStaffId));
//    }
}
