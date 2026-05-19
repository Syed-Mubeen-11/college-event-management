package com.college.eventmanagement.service;

import com.college.eventmanagement.dto.StudentUploadResult;
import com.college.eventmanagement.entity.Institution;
import com.college.eventmanagement.entity.User;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class StudentUploadService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public StudentUploadResult uploadStudents(MultipartFile file, Institution institution) {
        StudentUploadResult result = new StudentUploadResult();
        List<StudentUploadResult.StudentUploadError> errors = new ArrayList<>();
        int successCount = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            int rowNum = 1;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                rowNum++;
                String rowError = validateRow(row, rowNum);
                if (rowError != null) {
                    errors.add(new StudentUploadResult.StudentUploadError(rowNum, rowError));
                    continue;
                }

                String name = getCellStringValue(row.getCell(0));
                String email = getCellStringValue(row.getCell(1));
                String password = getCellStringValue(row.getCell(2));
                String branch = getCellStringValue(row.getCell(3));
                String year = getCellStringValue(row.getCell(4));

                if (userService.isEmailExists(email)) {
                    errors.add(new StudentUploadResult.StudentUploadError(rowNum, "Email already exists: " + email));
                    continue;
                }

                try {
                    User student = new User();
                    student.setInstitution(institution);
                    student.setName(name);
                    student.setEmail(email);
                    student.setPassword(passwordEncoder.encode(password));
                    student.setBranch(branch);
                    student.setYear(year);
                    student.setRole("STUDENT");
                    student.setIsActive(true);

                    userService.registerUser(student, institution.getId());
                    successCount++;
                } catch (Exception e) {
                    errors.add(new StudentUploadResult.StudentUploadError(rowNum, "Save failed: " + e.getMessage()));
                }
            }
        } catch (Exception e) {
            errors.add(new StudentUploadResult.StudentUploadError(0, "File processing error: " + e.getMessage()));
        }

        result.setSuccessCount(successCount);
        result.setFailureCount(errors.size());
        result.setErrors(errors);
        return result;
    }

    private String validateRow(Row row, int rowNum) {
        if (row == null) return "Row " + rowNum + ": Empty row";

        String name = getCellStringValue(row.getCell(0));
        String email = getCellStringValue(row.getCell(1));
        String password = getCellStringValue(row.getCell(2));
        String branch = getCellStringValue(row.getCell(3));
        String year = getCellStringValue(row.getCell(4));

        if (name == null || name.trim().isEmpty()) return "Row " + rowNum + ": Name is required";
        if (email == null || email.trim().isEmpty()) return "Row " + rowNum + ": Email is required";
        if (password == null || password.trim().isEmpty()) return "Row " + rowNum + ": Password is required";
        if (branch == null || branch.trim().isEmpty()) return "Row " + rowNum + ": Branch is required";
        if (year == null || year.trim().isEmpty()) return "Row " + rowNum + ": Year is required";
        if (!email.contains("@")) return "Row " + rowNum + ": Invalid email format";

        return null;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }
}