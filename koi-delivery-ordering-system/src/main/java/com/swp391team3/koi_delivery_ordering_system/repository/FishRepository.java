package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FishRepository extends JpaRepository<Fish, Long> {
    @Query("SELECT f FROM Fish f WHERE f.order.id = :orderId")
    List<Fish> findFishesByOrderId(Long orderId);
}
