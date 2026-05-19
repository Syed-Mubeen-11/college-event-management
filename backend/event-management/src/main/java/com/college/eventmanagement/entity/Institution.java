package com.college.eventmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "institutions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(unique = true, length = 100)
    private String emailDomain;
    
    @Column(length = 100)
    private String contactEmail;
    
    @Column(length = 20)
    private String contactPhone;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(length = 500)
    private String logoUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "signature_image_url", length = 500)
    private String signatureImageUrl;

    @Column(name = "organizer_title", length = 100)
    private String organizerTitle;

}
