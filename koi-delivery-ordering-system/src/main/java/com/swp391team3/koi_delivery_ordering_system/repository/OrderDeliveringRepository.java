package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.OrderDelivering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDeliveringRepository extends JpaRepository<OrderDelivering, Long> {
    @Query("SELECT od FROM OrderDelivering od WHERE od.driver.id = :deliveryStaffId")
    List<OrderDelivering> getOrderDeliveringByDeliveryStaffId(Long deliveryStaffId);

    Optional<OrderDelivering> findTopByOrderIdOrderByIdDesc(Long orderId);

    @Query("SELECT od FROM OrderDelivering od WHERE od.order.id = :orderId")
    Optional<OrderDelivering> findByOrderId(Long orderId);

    @Query("SELECT od FROM OrderDelivering od WHERE od.order.id = :orderId AND deliveryProcessType = :processType")
    Optional<OrderDelivering> findByOrderIdAndProcessType(Long orderId, int processType);
}
