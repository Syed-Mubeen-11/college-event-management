package com.college.eventmanagement.repository;

import com.college.eventmanagement.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    
    Optional<Institution> findByName(String name);
    
    Optional<Institution> findByEmailDomain(String emailDomain);
    
    Optional<Institution> findByContactEmail(String contactEmail);
}