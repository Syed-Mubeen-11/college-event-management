package com.college.eventmanagement.controller;

// import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.service.InstitutionService;
import com.college.eventmanagement.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.college.eventmanagement.service.EventService;
// import com.college.eventmanagement.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "Super Admin", description = "System-wide administration APIs")
public class SuperAdminController {
    
    @Autowired
    private InstitutionService institutionService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EventService eventService;
    
    // @Autowired
    // private RegistrationService registrationService;
    
    @GetMapping("/institutions")
    public ResponseEntity<?> getAllInstitutions(Authentication authentication) {
        try {
            List<Institution> institutions = institutionService.getAllInstitutions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Institutions retrieved successfully");
            response.put("count", institutions.size());
            response.put("institutions", institutions);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/institutions/{institutionId}")
    public ResponseEntity<?> getInstitutionDetails(@PathVariable Long institutionId, Authentication authentication) {
        try {
            Optional<Institution> institution = institutionService.getInstitutionById(institutionId);
            
            if (institution.isEmpty()) {
                return ResponseEntity.badRequest().body("Institution not found");
            }
            
            List<User> students = userService.getStudentsByInstitution(institution.get());
            List<User> admins = userService.getAdminsByInstitution(institution.get());
            List<com.college.eventmanagement.entity.Event> events = eventService.getEventsByInstitution(institution.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("institution", institution.get());
            response.put("stats", Map.of(
                "totalStudents", students.size(),
                "totalAdmins", admins.size(),
                "totalEvents", events.size(),
                "activeEvents", events.stream().filter(e -> e.getStatus().equals("UPCOMING")).count()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/institutions/{institutionId}/disable")
    public ResponseEntity<?> disableInstitution(@PathVariable Long institutionId, Authentication authentication) {
        try {
            institutionService.disableInstitution(institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Institution disabled successfully");
            response.put("institutionId", institutionId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/institutions/{institutionId}/enable")
    public ResponseEntity<?> enableInstitution(@PathVariable Long institutionId, Authentication authentication) {
        try {
            institutionService.enableInstitution(institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Institution enabled successfully");
            response.put("institutionId", institutionId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/institutions/{institutionId}")
    public ResponseEntity<?> updateInstitution(@PathVariable Long institutionId, @RequestBody Institution institutionDetails, Authentication authentication) {
        try {
            Institution updated = institutionService.updateInstitution(institutionId, institutionDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Institution updated successfully");
            response.put("institution", updated);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getSystemDashboard(Authentication authentication) {
        try {
            List<Institution> institutions = institutionService.getAllInstitutions();
            List<User> allUsers = userService.getAllUsers();
            List<com.college.eventmanagement.entity.Event> allEvents = eventService.getAllEvents();
            
            long totalStudents = allUsers.stream().filter(u -> u.getRole().equals("STUDENT")).count();
            long totalAdmins = allUsers.stream().filter(u -> u.getRole().equals("INSTITUTION_ADMIN")).count();
            long totalSuperAdmins = allUsers.stream().filter(u -> u.getRole().equals("SUPER_ADMIN")).count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalInstitutions", institutions.size());
            response.put("activeInstitutions", institutions.stream().filter(i -> i.getIsActive()).count());
            response.put("totalUsers", Map.of(
                "students", totalStudents,
                "institutionAdmins", totalAdmins,
                "superAdmins", totalSuperAdmins,
                "total", allUsers.size()
            ));
            response.put("totalEvents", allEvents.size());
            response.put("upcomingEvents", allEvents.stream().filter(e -> e.getStatus().equals("UPCOMING")).count());
            response.put("completedEvents", allEvents.stream().filter(e -> e.getStatus().equals("COMPLETED")).count());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}