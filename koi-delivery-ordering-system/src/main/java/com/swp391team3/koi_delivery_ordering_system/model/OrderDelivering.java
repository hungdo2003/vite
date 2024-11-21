package com.swp391team3.koi_delivery_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_delivering")
public class OrderDelivering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date createdDate;
    private Date lastUpdatedDate;
    private Date finishDate;
    private String currentAddress;
    private String longitude;
    private String latitude;
    private int deliveryProcessType;

    @ManyToOne
    @JoinColumn(name = "delivery_staff_id")
    @JsonIgnore
    private DeliveryStaff driver;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "order_id")
    private Order order;
}
