package com.spendmate.backend.controller;

import com.spendmate.backend.dto.AuthResponse;
import com.spendmate.backend.dto.LoginRequest;
import com.spendmate.backend.dto.RegisterRequest;
import com.spendmate.backend.entity.User;
import com.spendmate.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:5173"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        try {

            User user =
                    authService.register(
                            request.getName(),
                            request.getEmail(),
                            request.getPassword()
                    );

            AuthResponse response =
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            "Registration successful"
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

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
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        try {

            User user =
                    authService.login(
                            request.getEmail(),
                            request.getPassword()
                    );

            AuthResponse response =
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            "Login successful"
                    );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
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
}