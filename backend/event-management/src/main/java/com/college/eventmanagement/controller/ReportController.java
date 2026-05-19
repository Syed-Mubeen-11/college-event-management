package com.college.eventmanagement.controller;

import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.service.EventService;
import com.college.eventmanagement.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.college.eventmanagement.service.RegistrationService;
import com.college.eventmanagement.service.InstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('INSTITUTION_ADMIN')")
@Tag(name = "Reports", description = "Analytics and Reports APIs")
public class ReportController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RegistrationService registrationService;
    
    @Autowired
    private InstitutionService institutionService;
    
    private Institution getAdminInstitution(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Institution> institution = institutionService.getInstitutionById(userDetails.getInstitutionId());
        if (institution.isEmpty()) {
            throw new RuntimeException("Institution not found");
        }
        return institution.get();
    }
    
    @GetMapping("/events/{eventId}/branch-wise")
    public ResponseEntity<?> getBranchWiseReport(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Registration> registrations = registrationService.getRegistrationsByEvent(event);
            
            Map<String, Long> branchWise = registrations.stream()
                .filter(r -> !r.getCancelled())
                .collect(Collectors.groupingBy(
                    r -> r.getStudent().getBranch() != null ? r.getStudent().getBranch() : "Not Specified",
                    Collectors.counting()
                ));
            
            Map<String, Object> response = new HashMap<>();
            response.put("eventTitle", event.getTitle());
            response.put("totalRegistered", registrations.size());
            response.put("branchWise", branchWise);
            response.put("capacity", event.getCapacity());
            response.put("availableSpots", event.getCapacity() - registrations.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/events/{eventId}/year-wise")
    public ResponseEntity<?> getYearWiseReport(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Registration> registrations = registrationService.getRegistrationsByEvent(event);
            
            Map<String, Long> yearWise = registrations.stream()
                .filter(r -> !r.getCancelled())
                .collect(Collectors.groupingBy(
                    r -> r.getStudent().getYear() != null ? r.getStudent().getYear() : "Not Specified",
                    Collectors.counting()
                ));
            
            Map<String, Object> response = new HashMap<>();
            response.put("eventTitle", event.getTitle());
            response.put("totalRegistered", registrations.size());
            response.put("yearWise", yearWise);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/events/{eventId}/summary")
    public ResponseEntity<?> getEventSummary(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Registration> registrations = registrationService.getRegistrationsByEvent(event);
            
            Map<String, Long> branchWise = registrations.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getStudent().getBranch() != null ? r.getStudent().getBranch() : "Not Specified",
                    Collectors.counting()
                ));
            
            Map<String, Long> yearWise = registrations.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getStudent().getYear() != null ? r.getStudent().getYear() : "Not Specified",
                    Collectors.counting()
                ));
            
            List<Map<String, Object>> recentRegistrations = registrations.stream()
                .sorted((a, b) -> b.getRegisteredAt().compareTo(a.getRegisteredAt()))
                .limit(5)
                .map(r -> {
                    Map<String, Object> reg = new HashMap<>();
                    reg.put("studentName", r.getStudent().getName());
                    reg.put("studentEmail", r.getStudent().getEmail());
                    reg.put("branch", r.getStudent().getBranch());
                    reg.put("year", r.getStudent().getYear());
                    reg.put("registeredAt", r.getRegisteredAt());
                    return reg;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("event", Map.of(
                "id", event.getId(),
                "title", event.getTitle(),
                "venue", event.getVenue(),
                "startDate", event.getStartDate(),
                "endDate", event.getEndDate(),
                "capacity", event.getCapacity(),
                "status", event.getStatus()
            ));
            response.put("registrationStats", Map.of(
                "totalRegistered", registrations.size(),
                "availableSpots", event.getCapacity() - registrations.size(),
                "utilization", String.format("%.1f%%", (registrations.size() * 100.0 / event.getCapacity()))
            ));
            response.put("branchWise", branchWise);
            response.put("yearWise", yearWise);
            response.put("recentRegistrations", recentRegistrations);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard(Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            
            List<User> students = userService.getStudentsByInstitution(institution);
            List<Event> events = eventService.getEventsByInstitution(institution);
            List<Event> upcomingEvents = eventService.getUpcomingEvents(institution);
            
            int totalRegistrations = 0;
            for (Event event : events) {
                totalRegistrations += registrationService.getActiveRegistrationCount(event);
            }
            
            Event popularEvent = null;
            int maxRegistrations = 0;
            for (Event event : events) {
                int regCount = registrationService.getActiveRegistrationCount(event).intValue();
                if (regCount > maxRegistrations) {
                    maxRegistrations = regCount;
                    popularEvent = event;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("institution", Map.of(
                "name", institution.getName(),
                "totalStudents", students.size(),
                "totalEvents", events.size(),
                "upcomingEvents", upcomingEvents.size(),
                "totalRegistrations", totalRegistrations
            ));
            
            if (popularEvent != null) {
                response.put("popularEvent", Map.of(
                    "title", popularEvent.getTitle(),
                    "registrations", maxRegistrations,
                    "capacity", popularEvent.getCapacity()
                ));
            }
            
            response.put("recentUpcomingEvents", upcomingEvents.stream()
                .limit(5)
                .map(e -> Map.of(
                    "id", e.getId(),
                    "title", e.getTitle(),
                    "startDate", e.getStartDate(),
                    "registeredCount", registrationService.getActiveRegistrationCount(e),
                    "capacity", e.getCapacity()
                ))
                .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}