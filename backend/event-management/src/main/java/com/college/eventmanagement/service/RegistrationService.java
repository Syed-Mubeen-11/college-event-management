package com.college.eventmanagement.service;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {
    
    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private EventService eventService;
    
    
    // Register student for an event
    public Registration registerStudent(Event event, User student) {
        // Check if already registered
        if (registrationRepository.existsByStudentAndEventAndCancelledFalse(student, event)) {
            throw new RuntimeException("Student already registered for this event");
        }
        
        // Check if event has available spots
        if (!eventService.hasAvailableSpots(event.getId())) {
            throw new RuntimeException("Event is full");
        }
        
        // Check if event is closed
        if (event.getStatus().equals("CLOSED")) {
            throw new RuntimeException("Event registration is closed");
        }
        
        Registration registration = new Registration();
        registration.setStudent(student);
        registration.setEvent(event);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setCancelled(false);
        registration.setAttendanceMarked(false);
        
        Registration saved = registrationRepository.save(registration);
        
        
        return saved;
    }
    
    // Cancel registration (admin only)
    public void cancelRegistration(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setCancelled(true);
        registration.setCancelledAt(LocalDateTime.now());
        registrationRepository.save(registration);
    }
    
    // Get all registrations for an event
    public List<Registration> getRegistrationsByEvent(Event event) {
        return registrationRepository.findByEventAndCancelledFalse(event);
    }

    // Get registration by ID
    public Optional<Registration> getRegistrationById(Long registrationId) {
        return registrationRepository.findById(registrationId);
    }
    
    // Get all registrations for a student
    public List<Registration> getRegistrationsByStudent(User student) {
        return registrationRepository.findByStudentAndCancelledFalse(student);
    }
    
    // Get active registration count for an event
    public Long getActiveRegistrationCount(Event event) {
        return registrationRepository.countActiveRegistrationsByEvent(event);
    }
    
    // Check if student is registered for an event
    public boolean isStudentRegistered(User student, Event event) {
        return registrationRepository.existsByStudentAndEventAndCancelledFalse(student, event);
    }

    // Update attendance for a student
public Registration markAttendance(Long studentId, Long eventId, boolean attended, Integer percentage, String grade) {
    User student = userService.getUserById(studentId)
        .orElseThrow(() -> new RuntimeException("Student not found"));
    Event event = eventService.getEventById(eventId);
    
    Registration registration = registrationRepository.findByStudentAndEvent(student, event)
        .orElseThrow(() -> new RuntimeException("Registration not found"));
    
    registration.setAttendanceMarked(attended);
    if (percentage != null) {
        registration.setAttendancePercentage(percentage);
    }
    if (grade != null && !grade.isEmpty()) {
        registration.setGrade(grade);
    }
    
    return registrationRepository.save(registration);
}
}