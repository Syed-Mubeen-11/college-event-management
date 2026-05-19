package com.college.eventmanagement.dto;

import lombok.Data;

@Data
public class StudentDTO {
    private String name;
    private String email;
    private String password;
    private String branch;
    private String year;
}