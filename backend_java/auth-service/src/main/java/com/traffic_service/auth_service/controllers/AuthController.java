package com.traffic_service.auth_service.controllers;

import com.traffic_service.auth_service.model.AppUser;
import com.traffic_service.auth_service.service.AuthService;
import com.traffic_service.auth_service.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*; 


@RestController
@RequestMapping("/auth")  // ✅ no /api prefix, since gateway strips it
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<AppUser> userOptional = authService.findByUsername(username);
        if (userOptional.isEmpty()) return ResponseEntity.status(401).body("Invalid username or password");

        AppUser user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) return ResponseEntity.status(401).body("Invalid username or password");

        String token = jwtTokenProvider.generateToken(username, user.getRoles());

        return ResponseEntity.ok(Map.of(
                "username", username,
                "roles", user.getRoles(),
                "token", token
        ));
    }

   @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
    try {
        String username = (String) request.get("username");
        String password = (String) request.get("password");
        String email = (String) request.get("email");

        if (username == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));

        // ✅ Safely convert roles (ArrayList -> Set)
        Set<String> roles = new HashSet<>();
        Object rolesObj = request.get("roles");
        if (rolesObj instanceof List<?>) {
            roles.addAll((List<String>) rolesObj);
        } else {
            roles.add("USER"); // default role if missing
        }

        AppUser savedUser = authService.register(username, password, email, roles);
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail() != null ? savedUser.getEmail() : "",
                "roles", savedUser.getRoles()
        ));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(Map.of("error", "Unexpected server error"));
    }
}

@GetMapping("/profile")
public ResponseEntity<?> getProfile(@RequestHeader(value = "X-Username", required = false) String username) {
    if (username == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }
    
    Optional<AppUser> userOptional = authService.findByUsername(username);
    if (userOptional.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
    
    AppUser user = userOptional.get();
    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail() != null ? user.getEmail() : "",
            "roles", user.getRoles()
    ));
}

@PutMapping("/profile")
public ResponseEntity<?> updateProfile(
        @RequestHeader(value = "X-Username", required = false) String username,
        @RequestBody Map<String, Object> request) {
    if (username == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }
    
    try {
        Optional<AppUser> userOptional = authService.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        
        AppUser user = userOptional.get();
        String email = (String) request.get("email");
        if (email != null) {
            user.setEmail(email);
        }
        
        AppUser updated = authService.updateUser(user);
        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "username", updated.getUsername(),
                "email", updated.getEmail() != null ? updated.getEmail() : "",
                "roles", updated.getRoles()
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

@PutMapping("/change-password")
public ResponseEntity<?> changePassword(
        @RequestHeader(value = "X-Username", required = false) String username,
        @RequestBody Map<String, String> request) {
    if (username == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }
    
    try {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Old password and new password are required"));
        }
        
        boolean success = authService.changePassword(username, oldPassword, newPassword);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } else {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid old password"));
        }
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

}
