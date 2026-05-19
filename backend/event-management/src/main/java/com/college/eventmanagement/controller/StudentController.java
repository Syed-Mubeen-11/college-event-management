package com.college.eventmanagement.controller;

import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.service.EventService;
import com.college.eventmanagement.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.college.eventmanagement.service.RegistrationService;
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
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student", description = "Student operations for viewing and registering events")
public class StudentController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RegistrationService registrationService;
    
    // 1. Get all upcoming events for student's institution
    @GetMapping("/events")
    @Operation(summary = "Get all upcoming events", description = "Student can view all upcoming events in their institution")
    public ResponseEntity<?> getAllEvents(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            List<Event> events = eventService.getUpcomingEvents(student.getInstitution());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Events retrieved successfully");
            response.put("events", events);
            response.put("count", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 2. Get event details by ID
    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventDetails(@PathVariable Long eventId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            Event event = eventService.getEventById(eventId);
            
            // Check if event belongs to student's institution
            if (!event.getInstitution().getId().equals(student.getInstitution().getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Check if student is already registered
            boolean isRegistered = registrationService.isStudentRegistered(student, event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("event", event);
            response.put("isRegistered", isRegistered);
            response.put("availableSpots", event.getCapacity() - event.getRegisteredCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 3. Register for an event
    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            Event event = eventService.getEventById(eventId);
            
            // Check if event belongs to student's institution
            if (!event.getInstitution().getId().equals(student.getInstitution().getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Register the student
            Registration registration = registrationService.registerStudent(event, student);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Registration successful!");
            response.put("eventTitle", event.getTitle());
            response.put("registrationId", registration.getId());
            response.put("registeredAt", registration.getRegisteredAt());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    // 4. Get all events student registered for
    @GetMapping("/my-events")
    public ResponseEntity<?> getMyRegisteredEvents(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User student = userService.getUserById(userDetails.getId()).get();
            List<Registration> registrations = registrationService.getRegistrationsByStudent(student);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Your registered events");
            response.put("registrations", registrations);
            response.put("count", registrations.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}