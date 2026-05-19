package com.college.eventmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "institution_id")
    private Institution institution;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 20)
    private String role;  // SUPER_ADMIN, INSTITUTION_ADMIN, STUDENT
    
    @Column(length = 100)
    private String branch;  // Only for students
    
    @Column(length = 20)
    private String year;    // Only for students (1st Year, 2nd Year, 3rd Year, 4th Year)
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;
    }