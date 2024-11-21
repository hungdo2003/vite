package com.swp391team3.koi_delivery_ordering_system.utils;

import org.springframework.stereotype.Component;

@Component
public class OrderStatus {
    public final int DRAFT = 0;
    public final int POSTED = 1;
    public final int ORDER_ACCEPTED = 2;
    public final int ORDER_GETTING = 3;
    public final int ORDER_RECEIVED = 4;
    public final int ORDER_CONFIRMED = 5;
    public final int DELIVERING = 6;
    public final int COMPLETE = 7;
    public final int FAILED = 8;
    public final int ABORTED_BY_CUSTOMER = 9;
}
