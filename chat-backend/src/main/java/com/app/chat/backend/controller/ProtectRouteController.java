package com.app.chat.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ProtectRouteController {
    @GetMapping("/protect-route")
    public ResponseEntity<?> doAuth(HttpServletRequest request) {
        System.out.println(request.getCookies());
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    System.out.println(token);
                    return ResponseEntity.ok("Token Present");
                }
            }
        }
        return ResponseEntity.status(401).body("Token Missing");
    }
}
