package com.college.eventmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDTO {
    private String title;
    private String description;
    private String venue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer capacity;
}