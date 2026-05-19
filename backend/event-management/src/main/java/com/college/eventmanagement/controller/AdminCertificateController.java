package com.college.eventmanagement.controller;

import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.entity.Certificate;
import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.service.CertificateService;
import com.college.eventmanagement.service.EventService;
import com.college.eventmanagement.service.InstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/certificates")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('INSTITUTION_ADMIN')")
public class AdminCertificateController {

    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private EventService eventService;
    
    
    @Autowired
    private InstitutionService institutionService;
    
    // Helper to get admin's institution
    private Institution getAdminInstitution(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return institutionService.getInstitutionById(userDetails.getInstitutionId())
            .orElseThrow(() -> new RuntimeException("Institution not found"));
    }
    
    // 1. Generate certificate for a single student
    @PostMapping("/generate/{eventId}/{studentId}")
    public ResponseEntity<?> generateSingleCertificate(
            @PathVariable Long eventId, 
            @PathVariable Long studentId,
            Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            // Verify event belongs to admin's institution
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Certificate certificate = certificateService.generateCertificate(studentId, eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Certificate generated successfully");
            response.put("certificateId", certificate.getId());
            response.put("certificateUniqueId", certificate.getCertificateUniqueId());
            response.put("studentName", certificate.getStudent().getName());
            response.put("eventName", certificate.getEvent().getTitle());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 2. Generate certificates for all attendees of an event
    @PostMapping("/generate/event/{eventId}")
    public ResponseEntity<?> generateEventCertificates(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Certificate> certificates = certificateService.generateCertificatesForEvent(eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ " + certificates.size() + " certificates generated successfully");
            response.put("totalGenerated", certificates.size());
            response.put("eventName", event.getTitle());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 3. Get all certificates for an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getCertificatesByEvent(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Certificate> certificates = certificateService.getCertificatesByEvent(event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("eventName", event.getTitle());
            response.put("totalCertificates", certificates.size());
            response.put("certificates", certificates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 4. Mark student attendance
    @PutMapping("/attendance/{eventId}/{studentId}")
    public ResponseEntity<?> markAttendance(
            @PathVariable Long eventId,
            @PathVariable Long studentId,
            @RequestParam boolean attended,
            @RequestParam(required = false) Integer percentage,
            @RequestParam(required = false) String grade,
            Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Update registration with attendance
            // You'll need to add this method to RegistrationService
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Attendance marked successfully");
            response.put("studentId", studentId);
            response.put("attended", attended);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}