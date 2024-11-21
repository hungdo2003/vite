package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByOrderStatus(int status);

    @Query("SELECT o FROM Order o WHERE o.trackingId LIKE :trackingId AND o.orderStatus NOT IN (0)")
    Optional<Order> findByTrackingId(String trackingId);

    @Query("SELECT o FROM OrderDelivering od JOIN od.order o " +
            "WHERE od.order.id = :orderId " +
            "AND od.driver.id = :deliveryStaffId " +
            "AND od.deliveryProcessType = :deliveryProcessType " +
            "AND od.finishDate IS NULL")
    Optional<Order> findOrderByDeliveryStaffId(Long deliveryStaffId, Long orderId, int deliveryProcessType);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = :status")
    int countOrdersByStatus(int status);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId AND o.orderStatus = :status")
    List<Order> findByOrderStatusAndCustomerId(Long customerId, int status);
}
