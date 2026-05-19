package com.college.eventmanagement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.college.eventmanagement.config.JwtUtils;
import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.dto.InstitutionRegisterDTO;
import com.college.eventmanagement.dto.LoginRequestDTO;
import com.college.eventmanagement.dto.LoginResponseDTO;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.service.InstitutionService;
import com.college.eventmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and Registration APIs")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private InstitutionService institutionService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Value("${app.super-admin.secret-key}")
    private String superAdminSecretKey;
    
    @Value("${app.super-admin.email}")
    private String superAdminEmail;
    
    @Value("${app.super-admin.password}")
    private String superAdminPassword;
    
    @PostConstruct
    public void initSuperAdmin() {
        try {
            List<User> existing = userService.getAllUsersByEmail(superAdminEmail);
            // Filter for SUPER_ADMIN role only
            List<User> superAdmins = existing.stream()
                .filter(u -> "SUPER_ADMIN".equals(u.getRole()))
                .collect(Collectors.toList());
            
            if (superAdmins.isEmpty()) {
                User superAdmin = new User();
                superAdmin.setEmail(superAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
                superAdmin.setName("Super Admin");
                superAdmin.setRole("SUPER_ADMIN");
                superAdmin.setIsActive(true);
                userService.registerUser(superAdmin, null);
                System.out.println("✅ Super Admin user created on startup: " + superAdminEmail);
            } else {
                // If duplicates exist, delete extras
                if (superAdmins.size() > 1) {
                    System.out.println("⚠️ Found " + superAdmins.size() + " duplicate super admin users. Cleaning up...");
                    for (int i = 1; i < superAdmins.size(); i++) {
                        userService.deleteUser(superAdmins.get(i).getId());
                        System.out.println("   Deleted duplicate super admin ID: " + superAdmins.get(i).getId());
                    }
                }
                System.out.println("✅ Super Admin user ready: " + superAdminEmail);
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to create Super Admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Institution Self-Registration (Public)
    @PostMapping("/register/institution")
    public ResponseEntity<?> registerInstitution(@RequestBody InstitutionRegisterDTO registerDTO) {
        try {
            // Check if email already exists
            if (userService.isEmailExists(registerDTO.getAdminEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create Institution
            Institution institution = new Institution();
            institution.setName(registerDTO.getInstitutionName());
            institution.setEmailDomain(registerDTO.getEmailDomain());
            institution.setContactEmail(registerDTO.getContactEmail());
            institution.setContactPhone(registerDTO.getContactPhone());
            institution.setAddress(registerDTO.getAddress());
            institution.setIsActive(true);
            
            Institution savedInstitution = institutionService.createInstitution(institution);
            
            // Create Institution Admin with ENCODED password
            User admin = new User();
            admin.setInstitution(savedInstitution);
            admin.setEmail(registerDTO.getAdminEmail());
            admin.setPassword(passwordEncoder.encode(registerDTO.getAdminPassword())); // ✅ Now hashed
            admin.setName(registerDTO.getAdminName());
            admin.setRole("INSTITUTION_ADMIN");
            admin.setIsActive(true);
            
            User savedAdmin = userService.registerUser(admin, savedInstitution.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Institution registered successfully");
            response.put("institutionId", savedInstitution.getId());
            response.put("adminId", savedAdmin.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    // Login with JWT (Updated)
    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Login with email and password to get JWT token")
    @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Login successful"),
    @ApiResponse(responseCode = "401", description = "Invalid email or password")})
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // Authenticate using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), 
                            loginRequest.getPassword()
                    )
            );
            
            // Set authentication context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            // Get user details from authentication
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Get institution name if exists
            String institutionName = null;
            Long institutionId = userDetails.getInstitutionId();
            
            if (institutionId != null) {
                // Fetch institution name (optional - can be added if needed)
                institutionName = "Institution";
            }
            
            // Create response with JWT token
            LoginResponseDTO response = new LoginResponseDTO(
                "Login successful",
                jwt,                                    // ✅ Real JWT token
                userDetails.getRole(),
                userDetails.getId(),
                institutionId,
                institutionName
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    
    // Logout (optional - JWT is stateless)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless, no server-side logout needed
        // Client should just remove the token
        return ResponseEntity.ok(Map.of("message", "Logout successful. Please remove your token on client side."));
    }
    
    // Super Admin Login via Secret Key (Hidden Endpoint)
    @PostMapping("/super-admin/login")
    public ResponseEntity<?> superAdminLogin(@RequestBody Map<String, String> request) {
        try {
            String key = request.get("key");
            
            if (key == null || !superAdminSecretKey.equals(key)) {
                return ResponseEntity.status(401).body("Invalid secret key");
            }
            
            List<User> users = userService.getAllUsersByEmail(superAdminEmail);
            if (users.isEmpty()) {
                return ResponseEntity.status(500).body("Super Admin user not found. Restart the application to create it.");
            }
            
            User superAdmin = users.stream()
                .filter(u -> "SUPER_ADMIN".equals(u.getRole()))
                .findFirst()
                .orElse(null);
            
            if (superAdmin == null) {
                return ResponseEntity.status(500).body("No user with SUPER_ADMIN role found for configured email");
            }
            
            UserDetailsImpl userDetails = UserDetailsImpl.build(superAdmin);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            LoginResponseDTO response = new LoginResponseDTO(
                "Super Admin login successful",
                jwt,
                "SUPER_ADMIN",
                superAdmin.getId(),
                null,
                null
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Super Admin login failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }
}