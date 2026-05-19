package com.college.eventmanagement.service;

import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.repository.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InstitutionService {
    
    @Autowired
    private InstitutionRepository institutionRepository;
    
    // Create new institution
    public Institution createInstitution(Institution institution) {
        institution.setCreatedAt(java.time.LocalDateTime.now());
        institution.setUpdatedAt(java.time.LocalDateTime.now());
        return institutionRepository.save(institution);
    }
    
    // Get all institutions (Super Admin only)
    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }
    
    // Get institution by ID
    public Optional<Institution> getInstitutionById(Long id) {
        return institutionRepository.findById(id);
    }
    
    // Get institution by name
    public Optional<Institution> getInstitutionByName(String name) {
        return institutionRepository.findByName(name);
    }
    
    // Update institution
    public Institution updateInstitution(Long id, Institution institutionDetails) {
        Institution institution = institutionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Institution not found"));
        
        institution.setName(institutionDetails.getName());
        institution.setContactEmail(institutionDetails.getContactEmail());
        institution.setContactPhone(institutionDetails.getContactPhone());
        institution.setAddress(institutionDetails.getAddress());
        institution.setLogoUrl(institutionDetails.getLogoUrl());
        institution.setUpdatedAt(java.time.LocalDateTime.now());
        
        return institutionRepository.save(institution);
    }
    
    // Disable institution (Soft delete)
    public void disableInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Institution not found"));
        institution.setIsActive(false);
        institutionRepository.save(institution);
    }
    
    // Enable institution
    public void enableInstitution(Long id) {
        Institution institution = institutionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Institution not found"));
        institution.setIsActive(true);
        institutionRepository.save(institution);
    }
}