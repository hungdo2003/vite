package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.config.thirdParty.EmailService;
import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.OrderDelivering;
import com.swp391team3.koi_delivery_ordering_system.repository.DeliveryStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderDeliveringRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderRepository;
import com.swp391team3.koi_delivery_ordering_system.requestDto.EmailDetailDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderDeliveringUpdateInfoRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.OrderStatus;
import com.swp391team3.koi_delivery_ordering_system.utils.ProcessType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderDeliveringServiceImpl implements IOrderDeliveringService {
    private final OrderDeliveringRepository orderDeliveringRepository;
    private final OrderRepository orderRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final OrderStatus orderStatus;
    private final IOrderService orderService;
    private final EmailService emailService;

    @Override
    public void generateOrderGetting(Order order, DeliveryStaff deliveryStaff) {
        OrderDelivering orderDelivering = new OrderDelivering();

        orderDelivering.setCreatedDate(new Date());
        orderDelivering.setLastUpdatedDate(new Date());

        orderDelivering.setOrder(order);
        orderDelivering.setDriver(deliveryStaff);

        orderDelivering.setCurrentAddress(order.getSenderAddress());
        orderDelivering.setLongitude(order.getSenderLongitude());
        orderDelivering.setLatitude(order.getSenderLatitude());
        orderDelivering.setDeliveryProcessType(ProcessType.GETTING);

        orderDeliveringRepository.save(orderDelivering);
    }

    @Override
    public void generateOrderDelivering(Order order, DeliveryStaff deliveryStaff) {
        OrderDelivering orderDelivering = new OrderDelivering();

        orderDelivering.setCreatedDate(new Date());
        orderDelivering.setLastUpdatedDate(new Date());

        orderDelivering.setOrder(order);
        orderDelivering.setDriver(deliveryStaff);

        orderDelivering.setCurrentAddress(order.getSenderAddress());
        orderDelivering.setLongitude(order.getSenderLongitude());
        orderDelivering.setLatitude(order.getSenderLatitude());
        orderDelivering.setDeliveryProcessType(ProcessType.DELIVERING);

        orderDeliveringRepository.save(orderDelivering);
    }

    @Override
    public boolean startGetting(Long orderId, Long deliveryStaffId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<DeliveryStaff> optionalDeliveryStaff = deliveryStaffRepository.findById(deliveryStaffId);
        if (optionalOrder.isPresent() && optionalDeliveryStaff.isPresent()) {
            Order order = optionalOrder.get();
            if(orderService.updateOrderStatus(orderId, orderStatus.ORDER_GETTING)) {
                DeliveryStaff deliveryStaff = optionalDeliveryStaff.get();
                generateOrderGetting(order, deliveryStaff);

                //send mail
                EmailDetailDTO emailDetail = new EmailDetailDTO();
                emailDetail.setReceiver((Object) deliveryStaff);
                emailDetail.setSubject("You have receive " + order.getName() + " to get.");
                emailDetail.setLink("http://localhost:5173");
                emailService.sendEmail(emailDetail, 2);
                return true;
            }
        }
        return false;
    }

    @Override
    public OrderDelivering updateDeliveringInfo(OrderDeliveringUpdateInfoRequestDTO request) {
        Optional<OrderDelivering> foundOrderDelivering = orderDeliveringRepository.findById(request.getOrderDeliveringId());
        foundOrderDelivering.get().setLongitude(request.getLongitude());
        foundOrderDelivering.get().setLatitude(request.getLatitude());
        foundOrderDelivering.get().setCurrentAddress(request.getCurrentAddress());
        return orderDeliveringRepository.save(foundOrderDelivering.get());
    }

    @Override
    public Optional<OrderDelivering> getOrderDeliveringById(Long id) {
        return orderDeliveringRepository.findById(id);
    }

    @Override
    public boolean finishDelivering(Long id) {
        Optional<OrderDelivering> foundOrderDelivering = getOrderDeliveringById(id);
        if (foundOrderDelivering.isPresent()) {
            foundOrderDelivering.get().setFinishDate(new Date());
            orderDeliveringRepository.save(foundOrderDelivering.get());
            return true;
        }
        return false;
    }

    @Override
    public boolean startDelivering(Long orderId, Long deliveryStaffId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<DeliveryStaff> optionalDeliveryStaff = deliveryStaffRepository.findById(deliveryStaffId);
        if (optionalOrder.isPresent() && optionalDeliveryStaff.isPresent()) {
            Order order = optionalOrder.get();
            if(orderService.updateOrderStatus(orderId, orderStatus.DELIVERING)) {
                DeliveryStaff deliveryStaff = optionalDeliveryStaff.get();
                generateOrderDelivering(order, deliveryStaff);
                Customer customer = optionalOrder.get().getCustomer();

                //send mail for delivery staff
                EmailDetailDTO emailDetail = new EmailDetailDTO();
                emailDetail.setReceiver((Object) deliveryStaff);
                emailDetail.setSubject("You have receive " + order.getName() + " to delivery.");
                emailDetail.setLink("http://localhost:5173");
                emailService.sendEmail(emailDetail, 4);

                //send mail for customer
                emailDetail.setReceiver((Object) customer);
                emailDetail.setSubject("Order " + order.getName() + " is being delivered");
                emailDetail.setLink("http://localhost:5173");
                emailService.sendEmail(emailDetail, 5);
                return true;
            }
        }
        return false;
    }
}
