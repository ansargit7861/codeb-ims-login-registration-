package com.codeb.ims.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DashboardController {

    // Any authenticated user (ADMIN or SALES) can access their dashboard summary
    @GetMapping("/api/sales/dashboard")
    public Map<String, Object> salesDashboard(Authentication authentication) {
        return Map.of(
                "message", "Welcome to your dashboard",
                "email", authentication.getName()
        );
    }

    // Only ADMIN can access user management
    @GetMapping("/api/admin/users")
    public Map<String, Object> adminOnly(Authentication authentication) {
        return Map.of(
                "message", "Admin area - user management",
                "requestedBy", authentication.getName()
        );
    }
}
