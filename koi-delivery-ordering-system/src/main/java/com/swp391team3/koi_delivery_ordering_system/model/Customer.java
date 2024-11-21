package com.swp391team3.koi_delivery_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "customer")
public class Customer implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;
    private String phoneNumber;

    @Column(columnDefinition = "boolean default true")
    private boolean activeStatus;

    @OneToOne
    @JoinColumn(name = "avatar_id", referencedColumnName = "id")
    private File file;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private Set<Order> orders;

    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    private Set<Rating> ratingSet;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private Set<Transaction> transactions;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private Set<PaymentHistory> paymentHistorySet;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("Customer"));
        return authorities;
    }

    @Override

    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
