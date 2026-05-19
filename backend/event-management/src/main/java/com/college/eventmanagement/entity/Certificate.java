package com.college.eventmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(name = "certificate_unique_id", unique = true, nullable = false, length = 100)
    private String certificateUniqueId;
    
    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;
    
    @Column(name = "generated_at")
    private LocalDateTime generatedAt = LocalDateTime.now();
    
    @Column(name = "issue_date")
    private LocalDate issueDate = LocalDate.now();
    
    @Column(name = "duration_hours")
    private Integer durationHours;
    
    @Column(length = 20)
    private String grade;
    
    @Column(name = "organizer_name", length = 200)
    private String organizerName;
    
    @Column(name = "has_signature")
    private Boolean hasSignature = false;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
}