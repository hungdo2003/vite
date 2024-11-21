package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.config.thirdParty.EmailService;
import com.swp391team3.koi_delivery_ordering_system.exception.ValidationException;
import com.swp391team3.koi_delivery_ordering_system.model.*;
import com.swp391team3.koi_delivery_ordering_system.repository.*;
import com.swp391team3.koi_delivery_ordering_system.requestDto.*;
import com.swp391team3.koi_delivery_ordering_system.responseDto.OrderTrackingResponseDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderStatus orderStatus;
    private final IStorageService storageService;
    private final IFishService fishService;
    private final PriceBoard priceBoard;
    private final ISalesStaffService salesStaffService;
    private final EmailService emailService;
    private final IOrderDeliveringService orderDeliveringService;
    private final IDeliveryStaffService deliveryStaffService;
    private final IPaymentRateService paymentRateService;
    private final IOrderActionLogService orderActionLogService;
    private final OrderDeliveringRepository orderDeliveringRepository;
    private final LicenseFileRepository licenseFileRepository;
    private final IFileService fileService;
    private final LicenseRepository licenseRepository;
    private final FishRepository fishRepository;
    private final FileRepository fileRepository;
    private final OrderActionLogRepository orderActionLogRepository;
    private final SalesStaffRepository salesStaffRepository;
    private final StorageRepository storageRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final ValidationService validationService;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                            CustomerRepository customerRepository,
                            OrderStatus orderStatus, IStorageService storageService,
                            IFishService fishService, PriceBoard priceBoard,
                            ISalesStaffService salesStaffService, EmailService emailService,
                            @Lazy IOrderDeliveringService orderDeliveringService,
                            IDeliveryStaffService deliveryStaffService, IPaymentRateService paymentRateService,
                            IOrderActionLogService orderActionLogService,
                            OrderDeliveringRepository orderDeliveringRepository, LicenseFileRepository licenseFileRepository,
                            IFileService fileService, LicenseRepository licenseRepository, FishRepository fishRepository,
                            FileRepository fileRepository, OrderActionLogRepository orderActionLogRepository, SalesStaffRepository salesStaffRepository, StorageRepository storageRepository, DeliveryStaffRepository deliveryStaffRepository, ValidationService validationService) {
        this.orderActionLogService = orderActionLogService;
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.orderStatus = orderStatus;
        this.storageService = storageService;
        this.fishService = fishService;
        this.priceBoard = priceBoard;
        this.salesStaffService = salesStaffService;
        this.emailService = emailService;
        this.orderDeliveringService = orderDeliveringService;
        this.deliveryStaffService = deliveryStaffService;
        this.paymentRateService = paymentRateService;
        this.orderDeliveringRepository = orderDeliveringRepository;
        this.licenseFileRepository = licenseFileRepository;
        this.fileService = fileService;
        this.licenseRepository = licenseRepository;
        this.fishRepository = fishRepository;
        this.fileRepository = fileRepository;
        this.orderActionLogRepository = orderActionLogRepository;
        this.salesStaffRepository = salesStaffRepository;
        this.storageRepository = storageRepository;
        this.deliveryStaffRepository = deliveryStaffRepository;
        this.validationService = validationService;
    }

    public Long createGeneralInfoOrder(OrderGeneralInfoRequestDTO dto) {
        Storage nearestStorage = filterOrderToStorage(dto.getSenderLatitude(), dto.getSenderLongitude(),
                dto.getSenderAddress());
        if (nearestStorage != null) {
            Order newOrder = new Order();
            Optional<Customer> orderCreator = customerRepository.findById(dto.getCustomerId());
            newOrder.setCustomer(orderCreator.get());

            newOrder.setName(dto.getName());
            newOrder.setDescription(dto.getDescription());
            validationService.validateEmail(dto.getReceiverEmail());
            newOrder.setReceiverEmail(dto.getReceiverEmail());
            validationService.validatePhoneNumber(dto.getReceiverPhoneNumber());
            newOrder.setReceiverPhoneNumber(dto.getReceiverPhoneNumber());

            validationService.validateDuplicateAddress(dto.getSenderAddress(), dto.getSenderLatitude(), dto.getSenderLongitude()
            ,dto.getDestinationAddress(), dto.getDestinationLatitude(), dto.getDestinationLongitude());
            newOrder.setDestinationAddress(dto.getDestinationAddress());
            newOrder.setDestinationLatitude(dto.getDestinationLatitude());
            newOrder.setDestinationLongitude(dto.getDestinationLongitude());

            newOrder.setSenderAddress(dto.getSenderAddress());
            newOrder.setSenderLatitude(dto.getSenderLatitude());
            newOrder.setSenderLongitude(dto.getSenderLongitude());

            newOrder.setExpectedFinishDate(dto.getExpectedFinishDate());

            newOrder.setOrderStatus(orderStatus.ABORTED_BY_CUSTOMER); // 0 is not used, 1 is completed
            // Created date
            newOrder.setCreatedDate(new Date());
            Order savedOrder = orderRepository.save(newOrder);
            // Based on the order's id, generate the tracking code
            String trackingCode = Utilities.generateOrderCode("OD", savedOrder.getId());
            savedOrder.setTrackingId(trackingCode);
            savedOrder.setStorage(nearestStorage);

            orderRepository.save(newOrder);
            // return order's id for next step
            return savedOrder.getId();
        }
        return null;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public boolean deleteOrderById(Long id) {
        boolean result = false;
        Optional<Order> optionalOrder = getOrderById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            int currentStatus = order.getOrderStatus();
            if (currentStatus == orderStatus.DRAFT || currentStatus == orderStatus.POSTED) {
                Set<Fish> fishes = order.getFishes();
                if (fishes != null) {
                    for (Fish fish : fishes) {
                        Set<License> licenses = fish.getLicenses();
                        if (licenses != null) {
                            for (License license : licenses) {
                                Set<LicenseFile> licenseFiles = licenseFileRepository.findAll().stream()
                                        .filter(licenseFile1 -> licenseFile1.getLicense().equals(license))
                                        .collect(Collectors.toSet());
                                if (licenseFiles != null) {
                                    for (LicenseFile licenseFile : licenseFiles) {
                                        Long licenseFileId = licenseFile.getFile().getId();
                                        fileService.deleteFile(licenseFileId);
                                    }
                                    licenseFileRepository.deleteAll(licenseFiles);
                                }
                                licenseRepository.delete(license);
                            }
                        }
                        fishRepository.delete(fish);
                        if (fish.getFile() != null) {
                            fileRepository.delete(fish.getFile());
                            fileService.deleteFile(fish.getFile().getId());
                        }
                    }
                }
                orderRepository.deleteById(id);
                result = true;
                return result;
            } else {
                return result;
            }
        }
        return result;
    }

    @Override
    public Storage filterOrderToStorage(String senderLatitude, String senderLongitude, String senderAddress) {
        List<Storage> allStorages = storageService.getAllStorages();

        double minDistance = Double.MAX_VALUE;
        Storage nearestStorage = null;

        for (int index = 0; index < allStorages.size(); index++) {
            double orderLat = Double.parseDouble(senderLatitude);
            double orderLong = Double.parseDouble(senderLongitude);
            double storageLat = Double.parseDouble(allStorages.get(index).getLatitude());
            double storageLong = Double.parseDouble(allStorages.get(index).getLongitude());
            double distance = Utilities.calculateDistance(
                    orderLat, orderLong, storageLat, storageLong);
            String[] senderAddressArr = senderAddress.split(",");
            String[] storageAddress = allStorages.get(index).getAddress().split(",");
            String senderCountry = senderAddressArr[senderAddressArr.length - 1].trim();
            String storageCountry = storageAddress[storageAddress.length - 1].trim();
            boolean distanceResult = Utilities.compareCountry(senderCountry, storageCountry);
            if (distance <= 50 && distanceResult) {
                if (minDistance > distance) {
                    minDistance = distance;
                    nearestStorage = allStorages.get(index);
                }
            }
        }

        if (nearestStorage != null) {
            return nearestStorage;
        } else

        throw new ValidationException("The Order Is Not In Our Support Area");
    }

    @Override
    public boolean postOrder(Long id) {
        Optional<Order> completeOrder = getOrderById(id);
        completeOrder.get().setOrderStatus(orderStatus.POSTED);
        orderRepository.save(completeOrder.get());
        return true;
    }

    @Override
    public boolean updateOrderStatus(Long id, int newStatus) {
        Optional<Order> optionalOrder = getOrderById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            int currentStatus = order.getOrderStatus();

            switch (newStatus) {
                case 2:
                    if (currentStatus == orderStatus.POSTED) {
                        order.setOrderStatus(orderStatus.ORDER_ACCEPTED);
                    } else {
                        return false;
                    }
                    break;
                case 3:
                    if (currentStatus == orderStatus.ORDER_ACCEPTED) {
                        order.setOrderStatus(orderStatus.ORDER_GETTING);
                    } else {
                        return false;
                    }
                    break;
                case 4:
                    if (currentStatus == orderStatus.ORDER_GETTING) {
                        order.setOrderStatus(orderStatus.ORDER_RECEIVED);
                    } else {
                        return false;
                    }
                    break;
                case 5:
                    if (currentStatus == orderStatus.ORDER_RECEIVED) {
                        order.setOrderStatus(orderStatus.ORDER_CONFIRMED);
                    } else {
                        return false;
                    }
                    break;
                case 6:
                    if (currentStatus == orderStatus.ORDER_CONFIRMED) {
                        order.setOrderStatus(orderStatus.DELIVERING);
                    } else {
                        return false;
                    }
                    break;
                case 7:
                    if (currentStatus == orderStatus.DELIVERING) {
                        order.setOrderStatus(orderStatus.COMPLETE);
                    } else {
                        return false;
                    }
                    break;
                case 8:
                    order.setOrderStatus(orderStatus.FAILED);
                    break;
                case 9:
                    order.setOrderStatus(orderStatus.ABORTED_BY_CUSTOMER);
                    break;
                default:
                    return false;
            }

            orderRepository.save(order);
            return true;
        }
        return false;
    }

    @Override
    public List<Order> getOrderByStatus(int status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return orders;
    }

    @Override
    public List<Order> getOrderByStatusFilteredByCustomer(OrderListFilteredRequestDTO request) {
        List<Order> orders = orderRepository.findByOrderStatusAndCustomerId(request.getCustomerId(),
                request.getStatus());
        return orders;
    }

    private double calculateOrderPriceUtils(Long id) {
        List<Fish> fishList = fishService.getFishesByOrderId(id);
        Optional<Order> order = getOrderById(id);
        double distance = Utilities.calculateDistance(
                Double.parseDouble(order.get().getSenderLatitude()),
                Double.parseDouble(order.get().getSenderLongitude()),
                Double.parseDouble(order.get().getDestinationLatitude()),
                Double.parseDouble(order.get().getDestinationLongitude()));

        return getPrice(fishList, order, distance);
    }

    @Override
    public double calculateOrderPrice(Long id) {
        Optional<Order> order = getOrderById(id);
        double price = calculateOrderPriceUtils(id);
        order.get().setPrice(Math.floor(price));
        orderRepository.save(order.get());
        return price;
    }

    // @Override
    // public List<Order> findOrdersForDelivery(Long id) {
    // Optional<DeliveryStaff> optionalDeliveryStaff =
    // deliveryStaffRepository.findById(id);
    // if (optionalDeliveryStaff.isPresent()) {
    // DeliveryStaff deliveryStaff = optionalDeliveryStaff.get();
    //
    // List<Order> orders = orderRepository.findByOrderStatus(2);
    //
    // List<Order> result = orders.stream()
    // .filter(order -> Utilities.calculateDistance(
    // Double.parseDouble(deliveryStaff.getLatitude()),
    // Double.parseDouble(deliveryStaff.getLongitude()),
    // Double.parseDouble(order.getSenderLatitude()),
    // Double.parseDouble(order.getSenderLongitude())) <= 40)
    // .sorted(Comparator.comparingDouble(order -> Utilities.calculateDistance(
    // Double.parseDouble(deliveryStaff.getLatitude()),
    // Double.parseDouble(deliveryStaff.getLongitude()),
    // Double.parseDouble(order.getSenderLatitude()),
    // Double.parseDouble(order.getSenderLongitude()))))
    // .limit(5)
    // .collect(Collectors.toList());
    //
    // return result;
    // }
    // return null;
    // }

    @Override
    public List<Order> onGoingOrdersForDelivery(Long id, int deliveryProcessType, int orderStatus) {
        List<Order> gettingOrder = getOrderByStatus(orderStatus);
        List<Order> onGoingOrder = new ArrayList<>();
        for (int i = 0; i < gettingOrder.size(); i++) {
            Optional<Order> foundOrder = orderRepository.findOrderByDeliveryStaffId(id, gettingOrder.get(i).getId(),
                    deliveryProcessType);
            foundOrder.ifPresent(onGoingOrder::add);
        }
        return onGoingOrder;
    }

    // @Override
    // public boolean updateOrderSalesAction(Long orderId, Long salesId, int action)
    // {
    // Optional<Order> foundedOrder = getOrderById(orderId);
    // Optional<SalesStaff> foundedSalesStaff =
    // salesStaffService.getSalesStaffById(salesId);
    // switch(action) {
    // case 0:
    // foundedOrder.get().setSalesStaffAccept(foundedSalesStaff.get());
    // break;
    // case 1:
    // foundedOrder.get().setSalesStaffConfirmation(foundedSalesStaff.get());
    // break;
    // case 2:
    // foundedOrder.get().setSalesStaffCancellation(foundedSalesStaff.get());
    // break;
    // default:
    // return false;
    // }
    // orderRepository.save(foundedOrder.get());
    // return true;
    // }

    @Override
    public Optional<OrderTrackingResponseDTO> getOrderByTrackingId(String trackingId) {
        Optional<Order> orderOpt = orderRepository.findByTrackingId(trackingId);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            OrderTrackingResponseDTO responseDTO = new OrderTrackingResponseDTO();
            responseDTO.setTrackingId(order.getTrackingId());
            responseDTO.setNameSender(order.getCustomer().getUsername());
            responseDTO.setNameReceiver(order.getName());
            responseDTO.setOrderStatus(order.getOrderStatus());
            responseDTO.setCreatedDate(order.getCreatedDate());
            responseDTO.setFinishDate(order.getFinishDate());
            responseDTO.setExpectedFinishDate(order.getExpectedFinishDate());
            responseDTO.setFish(order.getFishes());
            responseDTO.setOrderLocation(order.getSenderAddress());

            int currentStatus = order.getOrderStatus();

            switch (currentStatus) {
                case 1:
                    responseDTO.setProccessType("Order has been posted");
                    responseDTO.setStaffType("None");
                    responseDTO.setStaffName("No staff involved");
                    responseDTO.setStaffNumber("N/A");
                    break;

                case 2:
                    responseDTO.setProccessType("Order has been accepted");
                    Long newestActionId = orderActionLogRepository.findNewestAction(order.getId());
                    if (newestActionId != null) {
                        orderActionLogRepository.findById(newestActionId).ifPresent(actionLog -> {
                            responseDTO.setStaffType("Sales Staff");
                            responseDTO.setStaffId(actionLog.getUserId());

                            salesStaffRepository.findById(actionLog.getUserId()).ifPresent(staff -> {
                                responseDTO.setStaffName(staff.getUsername());
                                responseDTO.setStaffNumber(staff.getPhoneNumber());
                            });
                        });
                    }
                    break;

                case 3:
                    responseDTO.setProccessType("Order is being prepared for pickup");
                    orderDeliveringRepository.findByOrderIdAndProcessType(order.getId(), 0).ifPresent(orderDelivering -> {
                        responseDTO.setStaffType("Delivery Staff");
                        responseDTO.setStaffId(orderDelivering.getDriver().getId());

                        deliveryStaffRepository.findById(orderDelivering.getDriver().getId()).ifPresent(driver -> {
                            responseDTO.setStaffName(driver.getUsername());
                            responseDTO.setStaffNumber(driver.getPhoneNumber());
                            responseDTO.setOrderLocation(driver.getAddress());
                        });
                    });
                    break;

                case 4:
                    responseDTO.setProccessType("Order has been received at storage");
                    storageRepository.findById(order.getStorage().getId()).ifPresent(storage -> {
                        responseDTO.setOrderLocation(storage.getName()+": "+storage.getAddress());
                    });
                    responseDTO.setStaffType("None");
                    responseDTO.setStaffName("No staff involved");
                    responseDTO.setStaffNumber("N/A");
                    break;

                case 5:
                    responseDTO.setProccessType("Order confirmed, now delivering");
                    Long newestActionIdConfirm = orderActionLogRepository.findNewestAction(order.getId());
                    if (newestActionIdConfirm != null) {
                        storageRepository.findById(order.getStorage().getId()).ifPresent(storage -> {
                            responseDTO.setOrderLocation(storage.getName()+": "+storage.getAddress());
                        });
                        orderActionLogRepository.findById(newestActionIdConfirm).ifPresent(actionLog -> {
                            responseDTO.setStaffType("Sales Staff");
                            responseDTO.setStaffId(actionLog.getUserId());

                            salesStaffRepository.findById(actionLog.getUserId()).ifPresent(staff -> {
                                responseDTO.setStaffName(staff.getUsername());
                                responseDTO.setStaffNumber(staff.getPhoneNumber());
                            });
                        });
                    }
                    break;

                case 6:
                    responseDTO.setProccessType("Order is being delivered");
                    orderDeliveringRepository.findByOrderIdAndProcessType(order.getId(), 1).ifPresent(orderDelivering -> {
                        responseDTO.setStaffType("Delivery Staff");
                        responseDTO.setStaffId(orderDelivering.getDriver().getId());

                        deliveryStaffRepository.findById(orderDelivering.getDriver().getId()).ifPresent(driver -> {
                                responseDTO.setStaffName(driver.getUsername());
                                responseDTO.setStaffNumber(driver.getPhoneNumber());
                                responseDTO.setOrderLocation(driver.getAddress());
                            });
                        });
                    break;
                case 7:
                    responseDTO.setProccessType("Order is delivered successfully");
                    orderDeliveringRepository.findByOrderIdAndProcessType(order.getId(), 1).ifPresent(orderDelivering -> {
                        responseDTO.setStaffType("Delivery Staff");
                        responseDTO.setStaffId(orderDelivering.getDriver().getId());
                        responseDTO.setFinishDate(orderDelivering.getFinishDate());

                        deliveryStaffRepository.findById(orderDelivering.getDriver().getId()).ifPresent(driver -> {
                            responseDTO.setStaffName(driver.getUsername());
                            responseDTO.setStaffNumber(driver.getPhoneNumber());
                            responseDTO.setOrderLocation(order.getDestinationAddress());
                        });
                    });
                    break;

                case 8:
                    responseDTO.setProccessType("Order has failed");
                    responseDTO.setCancelReason(order.getCancelReason());
                    newestActionIdConfirm = orderActionLogRepository.findNewestAction(order.getId());
                    orderActionLogRepository.findById(newestActionIdConfirm).ifPresent(actionLog -> {
                        if(actionLog.getActionType()==ActionType.CANCEL){
                            responseDTO.setStaffType("Sales Staff");
                            responseDTO.setStaffId(actionLog.getUserId());

                            salesStaffRepository.findById(actionLog.getUserId()).ifPresent(staff -> {
                                responseDTO.setStaffName(staff.getUsername());
                                responseDTO.setStaffNumber(staff.getPhoneNumber());
                        });
                        } else {
                            orderDeliveringRepository.findTopByOrderIdOrderByIdDesc(order.getId()).ifPresent(orderDelivering -> {
                                responseDTO.setStaffType("Delivery Staff");
                                responseDTO.setStaffId(orderDelivering.getDriver().getId());

                                deliveryStaffRepository.findById(orderDelivering.getDriver().getId()).ifPresent(driver -> {
                                    responseDTO.setStaffName(driver.getUsername());
                                    responseDTO.setStaffNumber(driver.getPhoneNumber());
                                    responseDTO.setOrderLocation(order.getDestinationAddress());
                                });
                            });
                        }
                    });
                    break;

                case 9:
                    responseDTO.setProccessType("Order has been aborted by the customer");
                    break;

                default:
                    responseDTO.setProccessType("Unknown status");
                    responseDTO.setStaffType("Unknown");
                    responseDTO.setStaffName("N/A");
                    responseDTO.setStaffNumber("N/A");
                    break;
            }

            return Optional.of(responseDTO);
        }

        return Optional.empty();
    }



    @Override
    public boolean finishOrder(FinishOrderUpdateRequestDTO request) {
        try {
            boolean result = false;

            Optional<Storage> foundStorage = storageService.getStorageById(request.getStorageId());
            Optional<Order> foundOrder = getOrderById(request.getOrderId());
            Optional<OrderDelivering> foundOrderDelivering = orderDeliveringService
                    .getOrderDeliveringById(request.getOrderDeliveringId());
            Optional<DeliveryStaff> foundDeliveryStaff = deliveryStaffService
                    .getDeliveryStaffById(request.getDeliveryStaffId());

            boolean updatedOrder = false;

            if (request.getProcessType() == 0) {
                updatedOrder = updateOrderStatus(foundOrder.get().getId(), orderStatus.ORDER_RECEIVED);
            } else if (request.getProcessType() == 1) {
                updatedOrder = updateOrderStatus(foundOrder.get().getId(), orderStatus.COMPLETE);
            }

            if (updatedOrder) {
                OrderDeliveringUpdateInfoRequestDTO dto = new OrderDeliveringUpdateInfoRequestDTO();
                dto.setOrderDeliveringId(foundOrderDelivering.get().getId());
                dto.setLatitude(foundStorage.get().getLatitude());
                dto.setLongitude(foundStorage.get().getLongitude());
                dto.setCurrentAddress(foundStorage.get().getAddress());

                OrderDelivering orderDeliveringResult = orderDeliveringService.updateDeliveringInfo(dto);
                if (orderDeliveringResult != null) {

                    DeliveryStaffLocationUpdateRequestDTO deliveryStaffDTO = new DeliveryStaffLocationUpdateRequestDTO();
                    deliveryStaffDTO.setId(foundDeliveryStaff.get().getId());
                    deliveryStaffDTO.setAddress(foundStorage.get().getAddress());
                    deliveryStaffDTO.setLatitude(foundStorage.get().getLatitude());
                    deliveryStaffDTO.setLongitude(foundStorage.get().getLongitude());

                    boolean updateResult = deliveryStaffService.updateDeliveryStaffLocation(deliveryStaffDTO);

                    if (updateResult) {
                        boolean finishResult = orderDeliveringService.finishDelivering(orderDeliveringResult.getId());
                        if (finishResult) {
                            // get sales staff
                            SalesStaff salesStaff = null;
                            if (request.getProcessType() == 0) {
                                // salesStaff = foundOrder.get().getSalesStaffAccept();
                                salesStaff = orderActionLogService.getSalesStaff(UserType.SALES_STAFF_ROLE_ID,
                                        foundOrder.get().getId(), ActionType.ACCEPT);
                                // send mail for sales staff
                                EmailDetailDTO emailDetail = new EmailDetailDTO();
                                emailDetail.setReceiver((Object) salesStaff);
                                emailDetail.setSubject("Order " + foundOrder.get().getName()
                                        + " has been successfully delivered to the storage");
                                emailService.sendEmail(emailDetail, 11);
                            } else if (request.getProcessType() == 1) {
                                // salesStaff = foundOrder.get().getSalesStaffConfirmation();
                                // send mail for sales staff
                                salesStaff = orderActionLogService.getSalesStaff(UserType.SALES_STAFF_ROLE_ID,
                                        foundOrder.get().getId(), ActionType.CONFIRM);
                                EmailDetailDTO emailDetail = new EmailDetailDTO();
                                emailDetail.setReceiver((Object) salesStaff);
                                emailDetail.setSubject("Order " + foundOrder.get().getName()
                                        + " has been successfully delivered to the receiver");
                                emailService.sendEmail(emailDetail, 8);
                                result = true;
                            }
                        }
                    }
                }
            }

            if (result) {
                // get customer
                Customer customer = foundOrder.get().getCustomer();
                // send mail
                EmailDetailDTO emailDetail = new EmailDetailDTO();
                emailDetail.setReceiver((Object) customer);
                emailDetail.setSubject("Order " + foundOrder.get().getName() + " has been successfully delivered");
                foundOrder.get().setFinishDate(new Date());
                orderRepository.save(foundOrder.get());
                emailDetail.setLink("http://localhost:5173" + "/invoice" +
                        "?orderId=" + foundOrder.get().getId() +
                        "&userId=" + customer.getId() +
                        "&username=" + customer.getUsername() +
                        "&email=" + customer.getEmail() +
                        "&phoneNumber=" + customer.getPhoneNumber());
                emailService.sendEmail(emailDetail, 3);
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Long updateOrder(Long orderId, String name, String description, Date expectedFinishDate,
            String destinationAddress, String destinationLongitude, String destinationLatitude,
            String senderAddress, String senderLongitude, String senderLatitude) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        order.setName(name);
        order.setDescription(description);
        order.setExpectedFinishDate(expectedFinishDate);
        order.setDestinationAddress(destinationAddress);
        order.setDestinationLongitude(destinationLongitude);
        order.setDestinationLatitude(destinationLatitude);
        order.setSenderAddress(senderAddress);
        order.setSenderLongitude(senderLongitude);
        order.setSenderLatitude(senderLatitude);
        double price = calculateOrderPriceUtils(orderId);
        if (price > order.getPrice()) {
            order.setPrice(Math.floor(price));
            order.setOrderStatus(orderStatus.DRAFT);
            orderRepository.save(order);
            return orderId;
        }
        return null;
    }

    private double getPrice(List<Fish> fishList, Optional<Order> order, double distance) {
        String[] senderAddress = order.get().getSenderAddress().split(",");
        String[] receiverAddress = order.get().getDestinationAddress().split(",");
        String senderCountry = senderAddress[senderAddress.length - 1].trim();
        String receiverCountry = receiverAddress[receiverAddress.length - 1].trim();
        boolean distanceCheck = Utilities.compareCountry(senderCountry, receiverCountry);
        // double distancePrice = priceBoard.PRICE_BASE * distance;
        double distancePrice = paymentRateService.getPaymentServiceById(priceBoard.PRICE_BASE_ID).get().getRate()
                * distance;
        // double koiPrice = priceBoard.BOX_PRICE * numberOfBoxes;
        double koiPrice = paymentRateService.getPaymentServiceById(priceBoard.PRICE_RATE_KOI).get().getRate()
                * fishList.size();

        if (distanceCheck) {
            // distancePrice = distancePrice * priceBoard.PRICE_RATE_DOMESTIC;
            distancePrice = distancePrice
                    * paymentRateService.getPaymentServiceById(priceBoard.PRICE_RATE_DOMESTIC_ID).get().getRate();
        } else {
            // distancePrice = distancePrice * priceBoard.PRICE_RATE_FOREIGN;
            distancePrice = distancePrice
                    * paymentRateService.getPaymentServiceById(priceBoard.PRICE_RATE_FOREIGN_ID).get().getRate();
        }
        return distancePrice + koiPrice;
    }

    @Override
    public boolean acceptOrder(Long orderId, Long salesId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        // Optional<SalesStaff> optionalSalesStaff =
        // salesStaffService.getSalesStaffById(salesId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (updateOrderStatus(orderId, orderStatus.ORDER_ACCEPTED)) {
                // order.setSalesStaffAccept(optionalSalesStaff.get());
                // orderRepository.save(order);
                boolean logResult = orderActionLogService.logOrderAction(UserType.SALES_STAFF_ROLE_ID, salesId,
                        ActionType.ACCEPT, order);
                if (logResult) {
                    Customer customer = optionalOrder.get().getCustomer();

                    // send mail for customer
                    EmailDetailDTO emailDetail = new EmailDetailDTO();
                    emailDetail.setReceiver((Object) customer);
                    emailDetail.setSubject("Order " + order.getName() + " has been accepted");
                    emailDetail.setLink("http://localhost:5173");
                    emailService.sendEmail(emailDetail, 6);

                    EmailDetailDTO emailDetailDTO = new EmailDetailDTO();
                    emailDetailDTO.setReceiver((Object) order);
                    emailDetailDTO.setSubject("You have " + order.getName() + " is being delivered to you");
                    emailDetailDTO.setLink(order.getTrackingId());
                    emailService.sendEmail(emailDetailDTO, 10);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean confirmOrder(Long orderId, Long salesId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<SalesStaff> optionalSalesStaff = salesStaffService.getSalesStaffById(salesId);

        if (optionalOrder.isPresent() && optionalSalesStaff.isPresent()) {
            Order order = optionalOrder.get();
            if (updateOrderStatus(orderId, orderStatus.ORDER_CONFIRMED)) {
                // order.setSalesStaffConfirmation(optionalSalesStaff.get());
                // orderRepository.save(order);
                boolean logResult = orderActionLogService.logOrderAction(UserType.SALES_STAFF_ROLE_ID, salesId,
                        ActionType.CONFIRM, order);
                if (logResult) {
                    Customer customer = optionalOrder.get().getCustomer();

                    // send mail for customer
                    EmailDetailDTO emailDetail = new EmailDetailDTO();
                    emailDetail.setReceiver((Object) customer);
                    emailDetail.setSubject("Order " + order.getId() + " has been confirmed");
                    emailDetail.setLink("http://localhost:5173");
                    emailService.sendEmail(emailDetail, 7);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean cancelOrder(StaffCancelOrderRequestDTO request) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(request.getOrderId());
        // Optional<SalesStaff> optionalSalesStaff =
        // salesStaffService.getSalesStaffById(salesId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (updateOrderStatus(request.getOrderId(), orderStatus.FAILED)) {
                boolean logResult = false;
                if (request.getUserType() == UserType.SALES_STAFF_ROLE_ID) {
                    logResult = orderActionLogService.logOrderAction(UserType.SALES_STAFF_ROLE_ID, request.getUserId(),
                            ActionType.CANCEL, order);
                } else if (request.getUserType() == UserType.DELIVERY_STAFF_ROLE_ID) {
                    logResult = orderActionLogService.logOrderAction(UserType.DELIVERY_STAFF_ROLE_ID,
                            request.getUserId(),
                            ActionType.CANCEL, order);
                } else {
                    throw new Exception("Undefined user type");
                }

                // order.setSalesStaffCancellation(optionalSalesStaff.get());
                // orderRepository.save(order);
                if (logResult) {
                    order.setCancelReason(request.getCancelReason());
                    orderRepository.save(order);

                    Customer customer = optionalOrder.get().getCustomer();

                    // send mail for customer
                    EmailDetailDTO emailDetail = new EmailDetailDTO();
                    emailDetail.setReceiver((Object) customer);
                    emailDetail.setSubject("Order " + order.getId() + " has been cancelled");
                    emailDetail.setLink("http://localhost:5173");
                    emailService.sendEmail(emailDetail, 9);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean abortOrder(Long orderId) {
        Optional<Order> foundOrder = orderRepository.findById(orderId);
        if (foundOrder.isPresent()) {
            Optional<OrderDelivering> foundOrderDelivering = orderDeliveringRepository
                    .findByOrderIdAndProcessType(orderId, ProcessType.GETTING);
            if (foundOrderDelivering.isPresent()) {
                orderDeliveringRepository.delete(foundOrderDelivering.get());
                foundOrder.get().setOrderStatus(orderStatus.ORDER_ACCEPTED);
                orderRepository.save(foundOrder.get());
                return true;
            }
        }
        return false;
    }
}
