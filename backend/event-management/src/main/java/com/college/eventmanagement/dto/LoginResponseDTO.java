package com.college.eventmanagement.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String message;
    private String token;
    private String type = "Bearer";
    private String role;
    private Long userId;
    private Long institutionId;
    private String institutionName;
    
    public LoginResponseDTO(String message, String token, String role, Long userId, Long institutionId, String institutionName) {
        this.message = message;
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.institutionId = institutionId;
        this.institutionName = institutionName;
    }
}