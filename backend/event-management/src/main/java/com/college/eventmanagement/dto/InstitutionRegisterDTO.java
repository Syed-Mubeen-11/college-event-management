package com.college.eventmanagement.dto;

import lombok.Data;

@Data
public class InstitutionRegisterDTO {
    private String institutionName;
    private String emailDomain;
    private String contactEmail;
    private String contactPhone;
    private String address;
    
    // Admin details
    private String adminName;
    private String adminEmail;
    private String adminPassword;
}