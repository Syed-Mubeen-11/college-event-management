package com.college.eventmanagement.service;

import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.repository.UserRepository;
import com.college.eventmanagement.repository.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstitutionRepository institutionRepository;
    
    // Register new user (student or admin)
    @Transactional
    public User registerUser(User user, Long institutionId) {
        if (institutionId != null) {
            Institution institution = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new RuntimeException("Institution not found"));
            user.setInstitution(institution);
        }
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        user.setIsActive(true);
        // Note: Password will be encoded later when we add Spring Security
        return userRepository.save(user);
    }
    
    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Get user by email and institution
    public Optional<User> getUserByEmailAndInstitution(String email, Institution institution) {
        return userRepository.findByEmailAndInstitution(email, institution);
    }
    
    // Get all students in an institution
    public List<User> getStudentsByInstitution(Institution institution) {
        return userRepository.findByInstitutionAndRole(institution, "STUDENT");
    }
    
    // Get all admins in an institution
    public List<User> getAdminsByInstitution(Institution institution) {
        return userRepository.findByInstitutionAndRole(institution, "INSTITUTION_ADMIN");
    }
    
    // Get students by branch
    public List<User> getStudentsByBranch(Institution institution, String branch) {
        return userRepository.findByInstitutionAndRoleAndBranch(institution, "STUDENT", branch);
    }
    
    // Get students by year
    public List<User> getStudentsByYear(Institution institution, String year) {
        return userRepository.findByInstitutionAndRoleAndYear(institution, "STUDENT", year);
    }
    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    

    // Get all users by email (handles duplicate emails)
    public List<User> getAllUsersByEmail(String email) {
        return userRepository.findAllByEmail(email);
    }
    
    // Get all users (Super Admin only)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Update student details
    public User updateStudent(Long studentId, String name, String branch, String year) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (name != null) student.setName(name);
        if (branch != null) student.setBranch(branch);
        if (year != null) student.setYear(year);
        student.setUpdatedAt(java.time.LocalDateTime.now());
        
        return userRepository.save(student);
    }
    public User updateUser(User user) {
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }


    // Delete user by ID
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // Check if email exists
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}