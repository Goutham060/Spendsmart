package com.spendmate.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spendmate.backend.entity.Expense;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    List<Expense> findByUserIdAndCategoryOrderByDateDesc(
            Long userId,
            String category
    );

    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(
            Long userId,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate
    );
}