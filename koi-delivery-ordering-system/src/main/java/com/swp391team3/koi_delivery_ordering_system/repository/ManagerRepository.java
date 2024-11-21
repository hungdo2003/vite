package com.swp391team3.koi_delivery_ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.swp391team3.koi_delivery_ordering_system.model.Manager;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Manager m WHERE m.email = :email")
    boolean existsByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Manager m WHERE m.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(String phoneNumber);

    Manager findByEmail(String email);
}
