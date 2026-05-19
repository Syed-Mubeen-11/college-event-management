package com.college.eventmanagement.controller;

import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.entity.Certificate;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.service.CertificateService;
import com.college.eventmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/certificates")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('STUDENT')")
public class StudentCertificateController {

    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private UserService userService;
    
    // 1. Get all my certificates
    @GetMapping("/my-certificates")
    public ResponseEntity<?> getMyCertificates(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            
            List<Certificate> certificates = certificateService.getCertificatesByStudent(student);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Your certificates");
            response.put("totalCertificates", certificates.size());
            response.put("certificates", certificates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 2. Download certificate by ID
    @GetMapping("/download/{certificateId}")
    public ResponseEntity<?> downloadCertificate(@PathVariable Long certificateId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            
            Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
            
            // Verify certificate belongs to the student
            if (!certificate.getStudent().getId().equals(student.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            byte[] pdfContent = certificateService.getCertificateFile(certificate);
            
            String filename = "certificate_" + certificate.getCertificateUniqueId() + ".pdf";
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 3. Get certificate details by ID
    @GetMapping("/{certificateId}")
    public ResponseEntity<?> getCertificateDetails(@PathVariable Long certificateId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            
            Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
            
            if (!certificate.getStudent().getId().equals(student.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(certificate);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}