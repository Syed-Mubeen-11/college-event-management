package com.college.eventmanagement.service;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    // Create event
    public Event createEvent(Event event) {
        // Check if end date is after start date
        if (event.getEndDate().isBefore(event.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        event.setRegisteredCount(0);
        return eventRepository.save(event);
    }
    
    // Get all events for an institution
    public List<Event> getEventsByInstitution(Institution institution) {
        return eventRepository.findByInstitution(institution);
    }
    
    // Get upcoming events for an institution
    public List<Event> getUpcomingEvents(Institution institution) {
        return eventRepository.findUpcomingEvents(institution);
    }
    
    // Get completed events for an institution
    public List<Event> getCompletedEvents(Institution institution) {
        return eventRepository.findCompletedEvents(institution);
    }
    
    // Get events by status
    public List<Event> getEventsByStatus(Institution institution, String status) {
        return eventRepository.findByInstitutionAndStatus(institution, status);
    }
    
    // Get event by ID
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    // Update event
    public Event updateEvent(Long eventId, Event eventDetails) {
        Event event = getEventById(eventId);
        
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setVenue(eventDetails.getVenue());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setCapacity(eventDetails.getCapacity());
        event.setUpdatedAt(LocalDateTime.now());
        
        return eventRepository.save(event);
    }
    
    // Close event registration (admin can manually close)
    public Event closeEventRegistration(Long eventId) {
        Event event = getEventById(eventId);
        event.setStatus("CLOSED");
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }
    
    // Reopen event registration
    public Event reopenEventRegistration(Long eventId) {
        Event event = getEventById(eventId);
        event.setStatus("UPCOMING");
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }
    
    // Delete event (cascades to registrations)
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

        // Get all events (Super Admin only)
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    // Check if event has available spots
    public boolean hasAvailableSpots(Long eventId) {
        Event event = getEventById(eventId);
        return event.getRegisteredCount() < event.getCapacity();
    }

    
}