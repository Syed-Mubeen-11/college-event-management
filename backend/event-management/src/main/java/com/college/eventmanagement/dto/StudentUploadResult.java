package com.college.eventmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentUploadResult {
    private int successCount;
    private int failureCount;
    private List<StudentUploadError> errors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentUploadError {
        private int row;
        private String message;
    }
}