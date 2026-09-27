package com.codeb.ims.service;

import com.codeb.ims.dto.*;
import com.codeb.ims.entity.User;
import com.codeb.ims.exception.ApiException;
import com.codeb.ims.repository.UserRepository;
import com.codeb.ims.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    private static final List<String> ALLOWED_ROLES = List.of("ADMIN", "SALES");

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("An account with this email already exists", HttpStatus.CONFLICT);
        }

        String role = request.getRole().trim().toUpperCase();
        if (!ALLOWED_ROLES.contains(role)) {
            throw new ApiException("Role must be either ADMIN or SALES", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(User.Status.inactive); // becomes active after email verification
        user.setVerificationToken(UUID.randomUUID().toString());

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), user.getVerificationToken());

        return new MessageResponse("Registration successful. Please check your email to verify your account.");
    }

    @Transactional
    public MessageResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ApiException("Invalid or expired verification link", HttpStatus.BAD_REQUEST));

        user.setStatus(User.Status.active);
        user.setVerificationToken(null);
        userRepository.save(user);

        return new MessageResponse("Email verified successfully. You can now log in.");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        if (user.getStatus() == User.Status.inactive) {
            throw new ApiException("Please verify your email before logging in", HttpStatus.FORBIDDEN);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ApiException("No account found with this email", HttpStatus.NOT_FOUND));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), token);

        return new MessageResponse("Password reset instructions have been sent to your email.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new ApiException("Invalid or expired reset link", HttpStatus.BAD_REQUEST));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ApiException("This reset link has expired. Please request a new one.", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successfully. You can now log in with your new password.");
    }
}
