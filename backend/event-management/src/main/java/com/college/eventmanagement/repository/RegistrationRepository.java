package com.college.eventmanagement.repository;

import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    
    List<Registration> findByStudent(User student);
    
    List<Registration> findByEvent(Event event);
    
    Optional<Registration> findByStudentAndEvent(User student, Event event);
    
    List<Registration> findByEventAndCancelledFalse(Event event);

    List<Registration> findByEventAndAttendanceMarkedTrue(Event event);
    
    List<Registration> findByStudentAndCancelledFalse(User student);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event = :event AND r.cancelled = false")
    Long countActiveRegistrationsByEvent(@Param("event") Event event);
    
    @Query("SELECT r.student, COUNT(r) FROM Registration r WHERE r.event.institution.id = :institutionId AND r.cancelled = false GROUP BY r.student")
    List<Object[]> countRegistrationsPerStudent(@Param("institutionId") Long institutionId);
    
    boolean existsByStudentAndEventAndCancelledFalse(User student, Event event);
}