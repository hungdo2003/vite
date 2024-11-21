package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.email = :email AND c.activeStatus = false")
    boolean existsByEmailRegisteredNotActive(String email);
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.email = :email AND c.activeStatus = true")
    boolean existsByEmailRegisteredActive(String email);
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.phoneNumber = :phoneNumber AND c.activeStatus = true")
    boolean existsByPhoneNumberRegisterdActive(String phoneNumber);

    @Query("SELECT c FROM Customer c WHERE c.email like :email")
    Customer findCustomerByEmail(String email);
    
}
