package com.college.eventmanagement.repository;

import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndInstitution(String email, Institution institution);
    
    List<User> findByInstitution(Institution institution);
    
    List<User> findByRole(String role);
    
    List<User> findByInstitutionAndRole(Institution institution, String role);
    
    List<User> findByInstitutionAndRoleAndBranch(Institution institution, String role, String branch);
    
    List<User> findByInstitutionAndRoleAndYear(Institution institution, String role, String year);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndInstitution(String email, Institution institution);
}