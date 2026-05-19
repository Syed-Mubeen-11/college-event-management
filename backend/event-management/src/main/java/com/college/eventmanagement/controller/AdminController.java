package com.college.eventmanagement.controller;

import com.college.eventmanagement.config.UserDetailsImpl;
import com.college.eventmanagement.dto.EventDTO;
import com.college.eventmanagement.dto.StudentDTO;
import com.college.eventmanagement.dto.StudentUploadResult;
import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.service.EventService;
import com.college.eventmanagement.service.InstitutionService;
import com.college.eventmanagement.service.UserService;
import com.college.eventmanagement.service.StudentUploadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.college.eventmanagement.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('INSTITUTION_ADMIN')")
@Tag(name = "Admin", description = "Admin operations for event and student management")
public class AdminController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RegistrationService registrationService;
    
     @Autowired
    private InstitutionService institutionService;

    @Autowired
    private PasswordEncoder passwordEncoder;   

    @Autowired
    private StudentUploadService studentUploadService; 
    
    // Helper method to get admin's institution
    private Institution getAdminInstitution(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Institution> institution = institutionService.getInstitutionById(userDetails.getInstitutionId());
        if (institution.isEmpty()) {
            throw new RuntimeException("Institution not found");
        }
        return institution.get();
    }
    
    // ===========================================
    // EVENT MANAGEMENT
    // ===========================================
    
   @PostMapping("/events")
   @Operation(summary = "Create new event", description = "Admin can create events for their institution")
   @ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Event created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input"),
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<?> createEvent(@RequestBody EventDTO eventDTO, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            Event event = new Event();
            event.setInstitution(institution);
            event.setTitle(eventDTO.getTitle());
            event.setDescription(eventDTO.getDescription());
            event.setVenue(eventDTO.getVenue());
            event.setStartDate(eventDTO.getStartDate());
            event.setEndDate(eventDTO.getEndDate());
            event.setCapacity(eventDTO.getCapacity());
            
            User admin = userService.getUserById(userDetails.getId()).get();
            event.setCreatedBy(admin);
            
            Event savedEvent = eventService.createEvent(event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Event created successfully");
            response.put("eventId", savedEvent.getId());
            response.put("event", savedEvent);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents(Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            List<Event> events = eventService.getEventsByInstitution(institution);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Events retrieved successfully");
            response.put("events", events);
            response.put("count", events.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/events/{eventId}/reopen")
    public ResponseEntity<?> reopenEventRegistration(@PathVariable Long eventId, Authentication authentication) {
    try {
        Institution institution = getAdminInstitution(authentication);
        Event event = eventService.getEventById(eventId);
        
        if (!event.getInstitution().getId().equals(institution.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }
        
        Event reopenedEvent = eventService.reopenEventRegistration(eventId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Event registration reopened");
        response.put("event", reopenedEvent);
        
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }
    }
    
    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(event);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody EventDTO eventDTO, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event existingEvent = eventService.getEventById(eventId);
            
            if (!existingEvent.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Event updatedEvent = new Event();
            updatedEvent.setTitle(eventDTO.getTitle());
            updatedEvent.setDescription(eventDTO.getDescription());
            updatedEvent.setVenue(eventDTO.getVenue());
            updatedEvent.setStartDate(eventDTO.getStartDate());
            updatedEvent.setEndDate(eventDTO.getEndDate());
            updatedEvent.setCapacity(eventDTO.getCapacity());
            
            Event savedEvent = eventService.updateEvent(eventId, updatedEvent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Event updated successfully");
            response.put("event", savedEvent);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            eventService.deleteEvent(eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Event deleted successfully");
            response.put("eventId", eventId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/events/{eventId}/close")
    public ResponseEntity<?> closeEventRegistration(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Event closedEvent = eventService.closeEventRegistration(eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Event registration closed");
            response.put("event", closedEvent);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    

    
    @GetMapping("/events/{eventId}/participants")
    public ResponseEntity<?> getEventParticipants(@PathVariable Long eventId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            Event event = eventService.getEventById(eventId);
            
            if (!event.getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Registration> registrations = registrationService.getRegistrationsByEvent(event);
            
            List<Map<String, Object>> participants = registrations.stream().map(reg -> {
                Map<String, Object> p = new HashMap<>();
                p.put("studentId", reg.getStudent().getId());
                p.put("studentName", reg.getStudent().getName());
                p.put("email", reg.getStudent().getEmail());
                p.put("branch", reg.getStudent().getBranch());
                p.put("year", reg.getStudent().getYear());
                p.put("registeredAt", reg.getRegisteredAt());
                return p;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("eventTitle", event.getTitle());
            response.put("totalRegistered", participants.size());
            response.put("capacity", event.getCapacity());
            response.put("participants", participants);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
  // ===========================================
// STUDENT MANAGEMENT
// ===========================================
    
@PostMapping("/students")
public ResponseEntity<?> addStudent(@RequestBody StudentDTO studentDTO, Authentication authentication) {
    try {
        Institution institution = getAdminInstitution(authentication);
        
        if (userService.isEmailExists(studentDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        User student = new User();
        student.setInstitution(institution);
        student.setEmail(studentDTO.getEmail());
        student.setPassword(passwordEncoder.encode(studentDTO.getPassword())); // ✅ THIS IS THE CHANGE
        student.setName(studentDTO.getName());
        student.setRole("STUDENT");
        student.setBranch(studentDTO.getBranch());
        student.setYear(studentDTO.getYear());
        student.setIsActive(true);
        
        User savedStudent = userService.registerUser(student, institution.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Student added successfully");
        response.put("studentId", savedStudent.getId());
        response.put("student", savedStudent);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }
}
    @PostMapping(value = "/students/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadStudents(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
                return ResponseEntity.badRequest().body("Please upload an Excel file (.xlsx or .xls)");
            }

            Institution institution = getAdminInstitution(authentication);
            StudentUploadResult result = studentUploadService.uploadStudents(file, institution);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Upload completed");
            response.put("successCount", result.getSuccessCount());
            response.put("failureCount", result.getFailureCount());
            response.put("errors", result.getErrors());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            List<User> students = userService.getStudentsByInstitution(institution);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Students retrieved successfully");
            response.put("students", students);
            response.put("count", students.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/students/branch/{branch}")
    public ResponseEntity<?> getStudentsByBranch(@PathVariable String branch, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            List<User> students = userService.getStudentsByBranch(institution, branch);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Students in " + branch);
            response.put("students", students);
            response.put("count", students.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/students/year/{year}")
    public ResponseEntity<?> getStudentsByYear(@PathVariable String year, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            List<User> students = userService.getStudentsByYear(institution, year);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Students in " + year);
            response.put("students", students);
            response.put("count", students.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/students/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @RequestBody StudentDTO studentDTO, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            
            Optional<User> studentOpt = userService.getUserById(studentId);
            if (studentOpt.isEmpty() || !studentOpt.get().getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            User updatedStudent = userService.updateStudent(studentId, studentDTO.getName(), studentDTO.getBranch(), studentDTO.getYear());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Student updated successfully");
            response.put("student", updatedStudent);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    // Update Admin Profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User admin = userService.getUserById(userDetails.getId()).get();
            
            if (profileData.containsKey("name")) {
                admin.setName(profileData.get("name"));
            }
            if (profileData.containsKey("phone")) {
                admin.setPhone(profileData.get("phone"));
            }
            if (profileData.containsKey("address")) {
                admin.setAddress(profileData.get("address"));
            }
            
            User updatedAdmin = userService.updateUser(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", updatedAdmin);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
public ResponseEntity<?> getProfile(Authentication authentication) {
    try {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User admin = userService.getUserById(userDetails.getId()).get();
        Institution institution = admin.getInstitution();
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("name", admin.getName());
        profile.put("email", admin.getEmail());
        profile.put("institutionName", institution != null ? institution.getName() : null);
        profile.put("phone", admin.getPhone());
        profile.put("address", admin.getAddress());
        
        return ResponseEntity.ok(profile);
        
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }
}


    @DeleteMapping("/registrations/{registrationId}/cancel")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long registrationId, Authentication authentication) {
        try {
            Institution institution = getAdminInstitution(authentication);
            
            Optional<Registration> regOpt = registrationService.getRegistrationById(registrationId);
            if (regOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Registration not found");
            }
            
            Registration registration = regOpt.get();
            
            if (!registration.getEvent().getInstitution().getId().equals(institution.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            registrationService.cancelRegistration(registrationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Registration cancelled successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}