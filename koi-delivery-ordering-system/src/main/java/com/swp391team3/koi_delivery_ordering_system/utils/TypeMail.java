package com.swp391team3.koi_delivery_ordering_system.utils;

import org.springframework.stereotype.Component;

@Component
public class TypeMail {
    public final int WELCOME_TEMPLATE = 1;
    public final int GETTING_DELIVERY_STAFF_TEMPLATE = 2;
    public final int COMPLETE_CUSTOMER_TEMPLATE = 3;
    public final int DELIVERING_DELIVERY_STAFF_TEMPLATE = 4;
    public final int DELIVERING_CUSTOMER_TEMPLATE = 5;
    public final int ACCEPT_CUSTOMER_TEMPLATE = 6;
    public final int CONFIRM_CUSTOMER_TEMPLATE = 7;
    public final int COMPLETE_SALES_STAFF_TEMPLATE = 8;
    public final int FAILED_CUSTOMER_TEMPLATE = 9;
    public final int RECEIVER_NOTIFICATION_TEMPLATE = 10;
    public final int RECEIVE_SALES_STAFF_TEMPLATE = 11;
    public final int FORGOT_PASSWORD_TEMPLATE = 12;
}
