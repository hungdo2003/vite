package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StorageRepository extends JpaRepository<Storage, Long> {
    @Query("SELECT COUNT(o) FROM Order o WHERE o.storage.id = :storageId AND o.orderStatus IN (4, 5)")
    int countByStorageId(Long storageId);
}
