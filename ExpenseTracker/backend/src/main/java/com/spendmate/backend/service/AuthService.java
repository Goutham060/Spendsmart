package com.spendmate.backend.service;

import com.spendmate.backend.entity.User;
import com.spendmate.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================
    // REGISTER
    // =========================================

    public User register(
            String name,
            String email,
            String password
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(
                passwordEncoder.encode(password)
        );

        return userRepository.save(user);
    }

    // =========================================
    // LOGIN
    // =========================================

    public User login(
            String email,
            String password
    ) {

        User user =
                userRepository
                        .findByEmail(
                                email.trim().toLowerCase()
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Invalid email or password"
                                        )
                        );

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        return user;
    }
}