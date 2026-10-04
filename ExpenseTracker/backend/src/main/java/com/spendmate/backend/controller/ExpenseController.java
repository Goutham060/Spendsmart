package com.spendmate.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spendmate.backend.entity.Expense;
import com.spendmate.backend.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(
            ExpenseService expenseService
    ) {
        this.expenseService = expenseService;
    }

    // =========================================
    // CREATE EXPENSE
    // =========================================

    @PostMapping
    public ResponseEntity<?> createExpense(
            @RequestParam Long userId,
            @RequestBody Expense expense
    ) {
        try {
            Expense createdExpense =
                    expenseService.createExpense(
                            expense,
                            userId
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdExpense);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // GET ALL USER EXPENSES
    // =========================================

    @GetMapping
    public ResponseEntity<?> getExpenses(
            @RequestParam Long userId
    ) {
        try {
            List<Expense> expenses =
                    expenseService.getUserExpenses(
                            userId
                    );

            return ResponseEntity.ok(expenses);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // GET EXPENSE BY ID
    // =========================================

    @GetMapping("/{expenseId}")
    public ResponseEntity<?> getExpense(
            @PathVariable Long expenseId,
            @RequestParam Long userId
    ) {
        try {
            Expense expense =
                    expenseService.getExpenseById(
                            expenseId,
                            userId
                    );

            return ResponseEntity.ok(expense);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // UPDATE EXPENSE
    // =========================================

    @PutMapping("/{expenseId}")
    public ResponseEntity<?> updateExpense(
            @PathVariable Long expenseId,
            @RequestParam Long userId,
            @RequestBody Expense expense
    ) {
        try {
            Expense updatedExpense =
                    expenseService.updateExpense(
                            expenseId,
                            expense,
                            userId
                    );

            return ResponseEntity.ok(
                    updatedExpense
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // DELETE EXPENSE
    // =========================================

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long expenseId,
            @RequestParam Long userId
    ) {
        try {
            expenseService.deleteExpense(
                    expenseId,
                    userId
            );

            return ResponseEntity.ok(
                    new MessageResponse(
                            "Expense deleted successfully"
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // FILTER BY CATEGORY
    // =========================================

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getByCategory(
            @PathVariable String category,
            @RequestParam Long userId
    ) {
        try {
            List<Expense> expenses =
                    expenseService.getByCategory(
                            userId,
                            category
                    );

            return ResponseEntity.ok(expenses);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // FILTER BY DATE RANGE
    // =========================================

    @GetMapping("/date-range")
    public ResponseEntity<?> getByDateRange(
            @RequestParam Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        try {
            List<Expense> expenses =
                    expenseService.getByDateRange(
                            userId,
                            startDate,
                            endDate
                    );

            return ResponseEntity.ok(expenses);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
    // ERROR RESPONSE
    // =========================================

    public static class ErrorResponse {

        private String message;

        public ErrorResponse() {
        }

        public ErrorResponse(
                String message
        ) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(
                String message
        ) {
            this.message = message;
        }
    }

    // =========================================
    // MESSAGE RESPONSE
    // =========================================

    public static class MessageResponse {

        private String message;

        public MessageResponse() {
        }

        public MessageResponse(
                String message
        ) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(
                String message
        ) {
            this.message = message;
        }
    }
}