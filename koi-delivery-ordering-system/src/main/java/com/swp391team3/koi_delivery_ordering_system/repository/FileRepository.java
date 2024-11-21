package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long>{
    Optional<File> findByName(String fileName);

    @Query("SELECT i.name FROM File i")
    List<String> getDuplicateImageName();

    @Query("SELECT COUNT(*) FROM File i")
    int getTotalImages();
}
