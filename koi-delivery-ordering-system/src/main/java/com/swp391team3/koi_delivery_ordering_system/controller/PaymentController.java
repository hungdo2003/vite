package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.service.IPaymentHistoryService;
import com.swp391team3.koi_delivery_ordering_system.service.IPaymentService;
import com.swp391team3.koi_delivery_ordering_system.service.ITransactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;
    private final IPaymentHistoryService paymentHistoryService;
    private final ITransactionService transactionService;

    //Create Payment
//    @PreAuthorize("hasAnyRole()")
    @GetMapping("/vn-pay/{customerId}")
    public ResponseEntity<?> pay(@PathVariable Long customerId, HttpServletRequest request) {
        return new ResponseEntity<>(paymentService.createVnPayPayment(request, customerId), HttpStatus.OK);
    }

//    @PreAuthorize("hasAnyRole()")
    @GetMapping("/vn-pay-callback/{id}")
    public RedirectView paymentCallback(
            @PathVariable(name = "id") Long id,
            @RequestParam(name = "vnp_Amount") String amount,
            @RequestParam(name = "vnp_BankCode") String bankCode,
            @RequestParam(name = "vnp_BankTranNo") String bankTranNo,
            @RequestParam(name = "vnp_CardType") String cardType,
            @RequestParam(name = "vnp_OrderInfo") String orderInfo,
            @RequestParam(name = "vnp_PayDate") String payDate,
            @RequestParam(name = "vnp_ResponseCode") String responseCode,
            @RequestParam(name = "vnp_TmnCode") String tmnCode,
            @RequestParam(name = "vnp_TransactionNo") String transactionNo,
            @RequestParam(name = "vnp_TransactionStatus") String transactionStatus,
            @RequestParam(name = "vnp_TxnRef") String txnRef,
            @RequestParam(name = "vnp_SecureHash") String secureHash) throws ParseException {

        // Validate and format payDate
        SimpleDateFormat formatDate = new SimpleDateFormat("yyyyMMddHHmmss");
        Date formattedPayDate = formatDate.parse(payDate);

        // Parse amount to double
        String modifiedAmount = amount.substring(0, amount.length() - 2);
        double parsedAmount = Double.parseDouble(modifiedAmount);
        // Create a transaction
        transactionService.createTransaction(id, formattedPayDate, parsedAmount);
        paymentHistoryService.confirmPaymentHistory(id, parsedAmount);

        try {
            return new RedirectView("http://localhost:5173" + "/payment-success" + "?amount=" + modifiedAmount + "&date=" + payDate + "&transactionNo=" + transactionNo);
        } catch (Exception e) {
            return new RedirectView("http://localhost:5173/404");
        }
    }

    //update Payment History
    //PASSED
//    @PutMapping("/{id}")
//    public ResponseEntity<?> updatePaymentHistory(@PathVariable Long id, @RequestBody OrderPaymentHistory orderPaymentHistory) {
//        return ResponseEntity.ok(paymentHistoryService.updatePaymentHistory(id, orderPaymentHistory.getDescription()));
//    }
}
