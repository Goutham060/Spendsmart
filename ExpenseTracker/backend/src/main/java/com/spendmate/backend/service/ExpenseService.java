package com.spendmate.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.spendmate.backend.entity.Expense;
import com.spendmate.backend.entity.User;
import com.spendmate.backend.repository.ExpenseRepository;
import com.spendmate.backend.repository.UserRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // =========================================
    // CREATE EXPENSE
    // =========================================

    public Expense createExpense(
            Expense expense,
            Long userId
    ) {
        User user = getUser(userId);

        expense.setId(null);
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    // =========================================
    // GET ALL USER EXPENSES
    // =========================================

    public List<Expense> getUserExpenses(
            Long userId
    ) {
        getUser(userId);

        return expenseRepository
                .findByUserIdOrderByDateDesc(userId);
    }

    // =========================================
    // GET EXPENSE BY ID
    // =========================================

    public Expense getExpenseById(
            Long expenseId,
            Long userId
    ) {
        getUser(userId);

        Expense expense =
                expenseRepository
                        .findById(expenseId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Expense not found"
                                )
                        );

        if (!expense.getUser()
                .getId()
                .equals(userId)) {

            throw new IllegalArgumentException(
                    "You are not allowed to access this expense"
            );
        }

        return expense;
    }

    // =========================================
    // UPDATE EXPENSE
    // =========================================

    public Expense updateExpense(
            Long expenseId,
            Expense updatedExpense,
            Long userId
    ) {
        Expense existingExpense =
                getExpenseById(
                        expenseId,
                        userId
                );

        existingExpense.setTitle(
                updatedExpense.getTitle()
        );

        existingExpense.setAmount(
                updatedExpense.getAmount()
        );

        existingExpense.setCategory(
                updatedExpense.getCategory()
        );

        existingExpense.setDate(
                updatedExpense.getDate()
        );

        existingExpense.setPaymentMethod(
                updatedExpense.getPaymentMethod()
        );

        existingExpense.setNotes(
                updatedExpense.getNotes()
        );

        existingExpense.setIcon(
                updatedExpense.getIcon()
        );

        return expenseRepository.save(
                existingExpense
        );
    }

    // =========================================
    // DELETE EXPENSE
    // =========================================

    public void deleteExpense(
            Long expenseId,
            Long userId
    ) {
        Expense expense =
                getExpenseById(
                        expenseId,
                        userId
                );

        expenseRepository.delete(expense);
    }

    // =========================================
    // FILTER BY CATEGORY
    // =========================================

    public List<Expense> getByCategory(
            Long userId,
            String category
    ) {
        getUser(userId);

        return expenseRepository
                .findByUserIdAndCategoryOrderByDateDesc(
                        userId,
                        category
                );
    }

    // =========================================
    // FILTER BY DATE RANGE
    // =========================================

    public List<Expense> getByDateRange(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        getUser(userId);

        return expenseRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(
                        userId,
                        startDate,
                        endDate
                );
    }

    // =========================================
    // GET USER
    // =========================================

    private User getUser(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "User not found"
                        )
                );
    }
}