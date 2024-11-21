package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesStaffRepository  extends JpaRepository<SalesStaff, Long> {
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SalesStaff s WHERE s.email = :email")
    boolean existsByEmail(String email);
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SalesStaff s WHERE s.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT ss FROM SalesStaff ss WHERE ss.email like :email")
    SalesStaff findSalesStaffByEmail(String email);
}
