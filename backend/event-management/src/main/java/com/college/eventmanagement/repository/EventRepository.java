package com.college.eventmanagement.repository;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByInstitution(Institution institution);
    
    List<Event> findByInstitutionAndStatus(Institution institution, String status);
    
    List<Event> findByCreatedBy(User createdBy);
    
    List<Event> findByStartDateAfter(LocalDateTime date);
    
    List<Event> findByEndDateBefore(LocalDateTime date);
    
    @Query("SELECT e FROM Event e WHERE e.institution = :institution AND e.startDate > CURRENT_TIMESTAMP AND e.status != 'CLOSED'")
    List<Event> findUpcomingEvents(@Param("institution") Institution institution);
    
    @Query("SELECT e FROM Event e WHERE e.institution = :institution AND e.endDate < CURRENT_TIMESTAMP")
    List<Event> findCompletedEvents(@Param("institution") Institution institution);
}