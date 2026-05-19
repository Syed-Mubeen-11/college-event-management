package com.college.eventmanagement.controller;

import com.college.eventmanagement.entity.Certificate;
import com.college.eventmanagement.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/certificates")
@CrossOrigin(origins = "*")
public class PublicCertificateController {

    @Autowired
    private CertificateService certificateService;
    
    // Verify certificate by unique ID (Public - no authentication needed)
    @GetMapping("/verify/{uniqueId}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String uniqueId) {
        try {
            boolean isValid = certificateService.verifyCertificate(uniqueId);
            
            Map<String, Object> response = new HashMap<>();
            
            if (isValid) {
                Certificate certificate = certificateService.getCertificateByUniqueId(uniqueId).get();
                response.put("isValid", true);
                response.put("message", "✅ This is a VALID certificate");
                response.put("studentName", certificate.getStudent().getName());
                response.put("eventName", certificate.getEvent().getTitle());
                response.put("collegeName", certificate.getEvent().getInstitution().getName());
                response.put("issueDate", certificate.getIssueDate());
                response.put("certificateId", certificate.getCertificateUniqueId());
            } else {
                response.put("isValid", false);
                response.put("message", "❌ This certificate is INVALID or does not exist");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("isValid", false);
            response.put("message", "Error verifying certificate: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}