package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.OrderActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderActionLogRepository extends JpaRepository<OrderActionLog, Long> {
    @Query("SELECT oal.userId FROM OrderActionLog oal WHERE oal.order.id = :orderId AND oal.roleId = :roleId AND oal.actionType = :actionType")
    Long getUserId(int roleId, Long orderId, int actionType);

    @Query("SELECT MAX(oal.id) FROM OrderActionLog oal WHERE oal.order.id = :orderId")
    Long findNewestAction(Long orderId);

}
