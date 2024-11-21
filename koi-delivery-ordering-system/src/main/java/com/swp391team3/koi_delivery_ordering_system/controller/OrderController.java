package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.exception.ValidationException;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.requestDto.*;
import com.swp391team3.koi_delivery_ordering_system.service.IOrderService;
import com.swp391team3.koi_delivery_ordering_system.utils.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;
    private final OrderStatus orderStatus;

    //Create Order
    //PASS
    @PreAuthorize("hasAuthority('Customer')")
    @PostMapping("/createOrderGeneralData")
    public ResponseEntity<?> createOrderGeneralInfo(@RequestBody OrderGeneralInfoRequestDTO request) {
        try{
            Long createdOrder = orderService.createGeneralInfoOrder(request);
            return ResponseEntity.ok(createdOrder);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('Customer')")
    @PostMapping("/postOrder/{id}")
    public ResponseEntity<?> postOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.postOrder(id));
    }

    //Get All Orders
    //PASSED
    @PreAuthorize("hasAuthority('Manager')")
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

//    @PreAuthorize("hasAuthority('Manager') or hasAuthority('SalesStaff') or hasAuthority('DeliveryStaff')")
    @GetMapping("/getOrderById/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('Customer')")
    @DeleteMapping("/deleteOrderById/{id}")
    public ResponseEntity<?> deleteOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.deleteOrderById(id));
    }

//    @PreAuthorize("hasAuthority('Manager') or hasAuthority('SalesStaff') or hasAuthority('DeliveryStaff')")
    @GetMapping("/getOrderByStatus/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable int status) {
        List<Order> orders = orderService.getOrderByStatus(status);

        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(orders);
        } else {
            return ResponseEntity.ok(orders);
        }
    }

    @PreAuthorize("hasAuthority('Customer')")
    @GetMapping("/get-orders-filtered")
    public ResponseEntity<?> getOrdersFilteredForCustomer(@RequestParam Long customerId,
                                                          @RequestParam int status) {
        OrderListFilteredRequestDTO request = new OrderListFilteredRequestDTO();
        request.setCustomerId(customerId);
        request.setStatus(status);
        List<Order> orders = orderService.getOrderByStatusFilteredByCustomer(request);
        return ResponseEntity.ok(orders);
    }

//    @PreAuthorize("hasAnyRole()")
    @PostMapping("/calculatePrice/{id}")
    public ResponseEntity<?> calculateOrderPrice(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.calculateOrderPrice(id));
    }

    @PreAuthorize("hasAuthority('SalesStaff') or hasAuthority('DeliveryStaff')")
    @PostMapping("/updateOrderStatus/{id}/{status}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @PathVariable int status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    //    @PutMapping("/updateOrderSales")
//    public ResponseEntity<?> updateOrderSalesAction(@RequestBody OrderSalesStaffCheckingRequestDTO request) {
//        return ResponseEntity.ok(orderService.updateOrderSalesAction(request.getOrderId(), request.getSalesId(), request.getActionStatus()));
//    }
//    @PreAuthorize("hasAuthority('Manager') or hasAuthority('SalesStaff') or hasAuthority('DeliveryStaff')")
//    @GetMapping("/recommendOrdersForDelivery/{deliveryStaffId}")
//    public ResponseEntity<?> recommendOrdersForDelivery(@PathVariable Long deliveryStaffId) {
//        return ResponseEntity.ok(orderService.findOrdersForDelivery(deliveryStaffId));
//    }

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @GetMapping("/onGoingOrder/{deliveryStaffId}/{deliveryProcessType}/{orderStatus}")
    public ResponseEntity<?> onGoingOrdersForDelivery(@PathVariable Long deliveryStaffId, @PathVariable int deliveryProcessType, @PathVariable int orderStatus) {
        return ResponseEntity.ok(orderService.onGoingOrdersForDelivery(deliveryStaffId, deliveryProcessType, orderStatus));
    }

//    @PreAuthorize("hasAnyRole()")
    @GetMapping("/searchOrderByTrackingId/{trackingId}")
    public ResponseEntity<?> getOrderByTrackingId(@PathVariable String trackingId) {
        return ResponseEntity.ok(orderService.getOrderByTrackingId(trackingId));
    }

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @PutMapping("/finishOrder")
    public ResponseEntity<?> finishOrder(@RequestBody FinishOrderUpdateRequestDTO request) {
        return ResponseEntity.ok(orderService.finishOrder(request));
    }

    @PreAuthorize("hasAuthority('Customer')")
    @PutMapping(value = "/editOrder/{orderId}")
    public ResponseEntity<?> editOrder(@PathVariable Long orderId, @RequestBody OrderGeneralInfoRequestDTO request) {

        Optional<Order> optionalOrder = orderService.getOrderById(orderId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            if (order.getOrderStatus() == orderStatus.DRAFT || order.getOrderStatus() == orderStatus.POSTED) {
                Long updatedOrderId = orderService.updateOrder(
                        orderId,
                        request.getName(),
                        request.getDescription(),
                        request.getExpectedFinishDate(),
                        request.getDestinationAddress(),
                        request.getDestinationLongitude(),
                        request.getDestinationLatitude(),
                        request.getSenderAddress(),
                        request.getSenderLongitude(),
                        request.getSenderLatitude()
                );
                return ResponseEntity.ok(updatedOrderId);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot edit order with status other than DRAFT or POSTED");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The order does not exist");
        }
    }

    @PreAuthorize("hasAuthority('SalesStaff')")
    @PutMapping("/accept-order")
    public ResponseEntity<?> acceptOrder(@RequestBody SalesCheckOrderRequestDTO request) {
        boolean createOrderDelivering = orderService.acceptOrder(request.getOrderId(), request.getSalesId());
        return ResponseEntity.ok(createOrderDelivering);
    }

    @PreAuthorize("hasAuthority('SalesStaff')")
    @PutMapping("/confirm-order")
    public ResponseEntity<?> confirmOrder(@RequestBody SalesCheckOrderRequestDTO request) {
        boolean createOrderDelivering = orderService.confirmOrder(request.getOrderId(), request.getSalesId());
        return ResponseEntity.ok(createOrderDelivering);
    }

    @PreAuthorize("hasAuthority('SalesStaff') or hasAuthority('DeliveryStaff')")
    @PutMapping("/cancel-order")
    public ResponseEntity<?> cancelOrder(@RequestBody StaffCancelOrderRequestDTO request) throws Exception {
        boolean createOrderDelivering = orderService.cancelOrder(request);
        return ResponseEntity.ok(createOrderDelivering);
    }

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @PutMapping("/abort-getting-order/{orderId}")
    public ResponseEntity<?> abortOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.abortOrder(orderId));
    }
}
