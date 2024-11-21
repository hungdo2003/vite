package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.Transaction;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements ITransactionService {
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;

    @Override
    public boolean createTransaction(Long customerId, Date createdDate, double amount) {
        try {
            Optional<Customer> paidCustomer = customerRepository.findById(customerId);
            Transaction transaction = new Transaction();
            transaction.setTransactionDate(createdDate);
            transaction.setAmount(amount);
            transaction.setCustomer(paidCustomer.get());
//            paidCustomer.get().setAmount(paidCustomer.get().getAmount() + amount);
//            customerRepository.save(paidCustomer.get());
            transactionRepository.save(transaction);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<Transaction> getAllTransactionsHistory() {
        return transactionRepository.findAll();
    }

    @Override
    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        List<Transaction> result = new ArrayList<>();
        if (customerId != null) {
            Optional<Customer> foundCustomer = customerRepository.findById(customerId);
            if (foundCustomer.isPresent()) {
                result = transactionRepository.getTransactionHistoryByCustomerId(customerId);
            }
        }
        return result;
    }
}
