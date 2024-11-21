package com.swp391team3.koi_delivery_ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swp391team3.koi_delivery_ordering_system.model.News;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long>{
    @Query("SELECT n FROM News n WHERE n.createdBy.id = :salesStaffId")
    List<News> getNewsBySalesStaff(Long salesStaffId);
}
