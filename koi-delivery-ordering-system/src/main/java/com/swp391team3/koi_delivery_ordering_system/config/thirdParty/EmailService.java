package com.swp391team3.koi_delivery_ordering_system.config.thirdParty;

import com.swp391team3.koi_delivery_ordering_system.model.*;
import com.swp391team3.koi_delivery_ordering_system.requestDto.EmailDetailDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.TypeMail;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    TemplateEngine templateEngine;
    @Autowired
    JavaMailSender javaMailSender;
    @Autowired
    TypeMail typeMail;

    public void sendEmail(EmailDetailDTO emailDetail, int type) {
        try {
            Context context = new Context();
            if(emailDetail.getReceiver() instanceof Customer){
                context.setVariable("name", ((Customer) emailDetail.getReceiver()).getEmail());
            } else if(emailDetail.getReceiver() instanceof DeliveryStaff){
                context.setVariable("name", ((DeliveryStaff) emailDetail.getReceiver()).getEmail());
            } else if(emailDetail.getReceiver() instanceof Manager){
                context.setVariable("name", ((Manager) emailDetail.getReceiver()).getEmail());
            } else if (emailDetail.getReceiver() instanceof SalesStaff) {
                context.setVariable("name", ((SalesStaff) emailDetail.getReceiver()).getEmail());
            } else if (emailDetail.getReceiver() instanceof Order) {
                context.setVariable("name", ((Order) emailDetail.getReceiver()).getReceiverEmail());
            } else {
                throw new IllegalArgumentException("Unknown user type");
            }
            context.setVariable("button", "Go to home page");
            context.setVariable("link", emailDetail.getLink());

            String template = templateEngine.process("welcome-template", context);
            if(type == typeMail.WELCOME_TEMPLATE) {
                template = templateEngine.process("welcome-template", context);
            } else if (type == typeMail.GETTING_DELIVERY_STAFF_TEMPLATE) {
                template = templateEngine.process("getting-deliveryStaff-template", context);
            } else if (type == typeMail.COMPLETE_CUSTOMER_TEMPLATE) {
                template = templateEngine.process("complete-customer-template", context);
            } else if (type == typeMail.DELIVERING_DELIVERY_STAFF_TEMPLATE){
                template = templateEngine.process("delivering-deliveryStaff-template", context);
            } else if (type == typeMail.DELIVERING_CUSTOMER_TEMPLATE){
                template = templateEngine.process("delivering-customer-template", context);
            } else if (type == typeMail.ACCEPT_CUSTOMER_TEMPLATE){
                template = templateEngine.process("accept-customer-template", context);
            } else if (type == typeMail.CONFIRM_CUSTOMER_TEMPLATE) {
                template = templateEngine.process("confirm-customer-template", context);
            } else if (type == typeMail.COMPLETE_SALES_STAFF_TEMPLATE){
                template = templateEngine.process("complete-salesStaff-template", context);
            } else if (type == typeMail.FAILED_CUSTOMER_TEMPLATE) {
                template = templateEngine.process("fail-customer-template", context);
            } else if (type == typeMail.RECEIVER_NOTIFICATION_TEMPLATE) {
                template = templateEngine.process("receiver-notification-template", context);
            } else if (type == typeMail.RECEIVE_SALES_STAFF_TEMPLATE) {
                template = templateEngine.process("receive-salesStaff-template", context);
            } else if (type == typeMail.FORGOT_PASSWORD_TEMPLATE){
                template = templateEngine.process("forgot-password-template", context);
            }

            //Creating a simple mail message
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

            //Setting up necessary details
            mimeMessageHelper.setFrom("koideliveringsystemswp@gmail.com");
//            if(emailDetail.getReceiver() instanceof Customer){
//                mimeMessageHelper.setTo(((Customer) emailDetail.getReceiver()).getEmail());
//            } else if(emailDetail.getReceiver() instanceof DeliveryStaff){
//                mimeMessageHelper.setTo(((DeliveryStaff) emailDetail.getReceiver()).getEmail());
//            } else if(emailDetail.getReceiver() instanceof Manager){
//                mimeMessageHelper.setTo(((Manager) emailDetail.getReceiver()).getEmail());
//            } else if (emailDetail.getReceiver() instanceof SalesStaff) {
//                mimeMessageHelper.setTo(((SalesStaff) emailDetail.getReceiver()).getEmail());
//            } else {
//                throw new IllegalArgumentException("Unknown user type");
//            }
            mimeMessageHelper.setTo((String) context.getVariable("name"));
            mimeMessageHelper.setText(template, true);
            mimeMessageHelper.setSubject(emailDetail.getSubject());

            //send email
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.out.println("ERROR SENT EMAIL!");
        }
    }
}
