package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DeliveryStaffRepository extends JpaRepository<DeliveryStaff, Long> {
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM DeliveryStaff d WHERE d.email = :email")
    boolean existsByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM DeliveryStaff d WHERE d.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT ds FROM DeliveryStaff ds WHERE ds.email like :email")
    DeliveryStaff findDeliveryStaffByEmail(String email);
}
