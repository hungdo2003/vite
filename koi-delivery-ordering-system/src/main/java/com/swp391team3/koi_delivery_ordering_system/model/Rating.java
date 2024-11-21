package com.swp391team3.koi_delivery_ordering_system.model;

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
@Table(name = "rating")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int rateStar;
    private String comment;
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer createdBy;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order ratedFor;
}
