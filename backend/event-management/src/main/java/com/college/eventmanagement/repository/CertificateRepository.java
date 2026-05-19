package com.college.eventmanagement.repository;

import com.college.eventmanagement.entity.Certificate;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    List<Certificate> findByStudent(User student);
    
    List<Certificate> findByEvent(Event event);
    
    Optional<Certificate> findByCertificateUniqueId(String uniqueId);
    
    List<Certificate> findByStudentAndEvent(User student, Event event);
    
    boolean existsByStudentAndEvent(User student, Event event);
}