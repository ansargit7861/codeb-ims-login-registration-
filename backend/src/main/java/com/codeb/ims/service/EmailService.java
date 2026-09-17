package com.codeb.ims.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@codeb-ims.com}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        String body = "Hi " + fullName + ",\n\n"
                + "Welcome to the Code-B MIS & Invoicing System. Please verify your email by clicking the link below:\n\n"
                + link + "\n\n"
                + "If you did not create this account, please ignore this email.\n\n"
                + "- Code-B IMS Team";
        send(toEmail, "Verify your Code-B IMS account", body);
    }

    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        String body = "Hi " + fullName + ",\n\n"
                + "We received a request to reset your password. Click the link below to set a new password. "
                + "This link expires in 30 minutes.\n\n"
                + link + "\n\n"
                + "If you did not request this, you can safely ignore this email.\n\n"
                + "- Code-B IMS Team";
        send(toEmail, "Reset your Code-B IMS password", body);
    }

    private void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            // In dev/sandbox environments without SMTP configured, log instead of failing the request.
            System.out.println("[EmailService] Could not send email to " + to + ": " + e.getMessage());
        }
    }
}
