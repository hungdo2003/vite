package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.Rating;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.RatingRepository;
import com.swp391team3.koi_delivery_ordering_system.requestDto.CustomerFeedbackRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements IRatingService {
    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @Override
    public CustomerFeedbackRequestDTO createRating(CustomerFeedbackRequestDTO request) {
        Rating rating = new Rating();
        rating.setCreatedDate(new Date());
        rating.setComment(request.getComment());
        rating.setRateStar(request.getRateStar());
        Optional<Customer> customer = customerRepository.findById(request.getUserId());
        Optional<Order> order = orderRepository.findById(request.getOrderId());
        rating.setCreatedBy(customer.get());
        rating.setRatedFor(order.get());
        ratingRepository.save(rating);
        return request;
    }

    @Override
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

//    @Override
//    public Optional<Rating> getRatingById(Long id) {
//        return ratingRepository.findById(id);
//    }
//
//    @Override
//    public void deleteRatingById(Long id) {
//        ratingRepository.deleteById(id);
//    }
}
