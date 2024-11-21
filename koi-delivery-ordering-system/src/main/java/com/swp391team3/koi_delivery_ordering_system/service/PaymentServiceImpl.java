package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.config.thirdParty.VNPayConfiguration;
import com.swp391team3.koi_delivery_ordering_system.responseDto.PaymentResponseDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements IPaymentService {
    private final VNPayConfiguration vnPayConfiguration;

    @Override
    public PaymentResponseDTO createVnPayPayment(HttpServletRequest request, Long customerId)  {
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfiguration.getVNPayConfig(customerId);
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfiguration.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
//        queryUrl += "&customer_id=" + request.getParameter("customerId");
        String paymentUrl = vnPayConfiguration.getVnp_PayUrl() + "?" + queryUrl;
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setCode("ok");
        response.setMessage("success");
        response.setPaymentUrl(paymentUrl);
//        for (Map.Entry<String, String> entry : vnpParamsMap.entrySet()) {
//            System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
//        }
        return response;
    }
}
