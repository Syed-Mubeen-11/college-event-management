package com.college.eventmanagement.service;

import com.college.eventmanagement.entity.*;
import com.college.eventmanagement.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.List;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EventService eventService;
    
    @Value("${certificate.storage.path:certificates}")
    private String storagePath;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
    
    public Certificate generateCertificate(Long studentId, Long eventId) throws Exception {
        User student = userService.getUserById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Event event = eventService.getEventById(eventId);
        
        if (certificateRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("Certificate already generated for this student");
        }
        
        if (!event.getEndDate().isBefore(java.time.LocalDateTime.now()) && !"CLOSED".equals(event.getStatus())) {
            throw new RuntimeException("Certificate can only be generated after event completion or when event is closed");
        }
        
        Registration registration = registrationRepository.findByStudentAndEvent(student, event)
            .orElseThrow(() -> new RuntimeException("Student not registered for this event"));
        
        String certificateId = generateCertificateId(event, student);
        String pdfUrl = generatePdfFile(student, event, registration, certificateId);
        
        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setEvent(event);
        certificate.setCertificateUniqueId(certificateId);
        certificate.setCertificateUrl(pdfUrl);
        certificate.setGeneratedAt(java.time.LocalDateTime.now());
        certificate.setIssueDate(LocalDate.now());
        
        long durationHours = ChronoUnit.HOURS.between(event.getStartDate(), event.getEndDate());
        certificate.setDurationHours((int) durationHours);
        
        if (registration.getGrade() != null) {
            certificate.setGrade(registration.getGrade());
        }
        
        Institution institution = event.getInstitution();
        certificate.setOrganizerName(institution.getOrganizerTitle());
        certificate.setHasSignature(institution.getSignatureImageUrl() != null);
        certificate.setIsVerified(true);
        
        return certificateRepository.save(certificate);
    }
    
    public List<Certificate> generateCertificatesForEvent(Long eventId) throws Exception {
        Event event = eventService.getEventById(eventId);
        
        if (!event.getEndDate().isBefore(java.time.LocalDateTime.now()) && !"CLOSED".equals(event.getStatus())) {
            throw new RuntimeException("Certificates can only be generated after event completion or when event is closed");
        }
        
        List<Registration> registrations = registrationRepository.findByEventAndAttendanceMarkedTrue(event);
        
        if (registrations.isEmpty()) {
            throw new RuntimeException("No attendees found for this event");
        }
        
        List<Certificate> certificates = new ArrayList<>();
        for (Registration registration : registrations) {
            try {
                Certificate certificate = generateCertificate(
                    registration.getStudent().getId(), 
                    eventId
                );
                certificates.add(certificate);
            } catch (Exception e) {
                System.err.println("Error generating certificate for student: " + e.getMessage());
            }
        }
        
        return certificates;
    }
    
    private String generatePdfFile(User student, Event event, Registration registration, String certificateId) throws Exception {
        // Get absolute path to certificates folder
        String projectRoot = System.getProperty("user.dir");
        String certDirPath = projectRoot + File.separator + storagePath;
        
        File storageDir = new File(certDirPath);
        if (!storageDir.exists()) {
            storageDir.mkdirs();
            System.out.println("Created certificates directory at: " + certDirPath);
        }
        
        String filename = "certificate_" + event.getId() + "_" + student.getId() + ".pdf";
        String filePath = certDirPath + File.separator + filename;
        String webPath = "/certificates/" + filename;
        
        System.out.println("Generating certificate at: " + filePath);
        
        // Create PDF document
        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();
        
        // Fonts
        Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD);
        Font subTitleFont = new Font(Font.HELVETICA, 16, Font.NORMAL);
        Font nameFont = new Font(Font.HELVETICA, 32, Font.BOLD);
        Font eventFont = new Font(Font.HELVETICA, 20, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
        Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        
        // Add Rectangle Border
        PdfContentByte cb = writer.getDirectContent();
        cb.setLineWidth(3f);
        cb.setRGBColorStroke(197, 160, 40); // Gold color
        cb.rectangle(36, 36, PageSize.A4.getWidth() - 72, PageSize.A4.getHeight() - 72);
        cb.stroke();
        
        // College Name
        Paragraph college = new Paragraph(event.getInstitution().getName(), titleFont);
        college.setAlignment(Element.ALIGN_CENTER);
        college.setSpacingAfter(5);
        document.add(college);
        
        // Department
        Paragraph dept = new Paragraph("Department of Education", subTitleFont);
        dept.setAlignment(Element.ALIGN_CENTER);
        dept.setSpacingAfter(40);
        document.add(dept);
        
        // CERTIFICATE Title
        Paragraph certTitle = new Paragraph("CERTIFICATE", new Font(Font.HELVETICA, 36, Font.BOLD));
        certTitle.setAlignment(Element.ALIGN_CENTER);
        certTitle.setSpacingAfter(5);
        document.add(certTitle);
        
        Paragraph ofAchievement = new Paragraph("OF ACHIEVEMENT", new Font(Font.HELVETICA, 18, Font.NORMAL));
        ofAchievement.setAlignment(Element.ALIGN_CENTER);
        ofAchievement.setSpacingAfter(40);
        document.add(ofAchievement);
        
        // Presented to
        Paragraph presented = new Paragraph("This is proudly presented to", normalFont);
        presented.setAlignment(Element.ALIGN_CENTER);
        presented.setSpacingAfter(15);
        document.add(presented);
        
        // Student Name
        Paragraph studentName = new Paragraph(student.getName().toUpperCase(), nameFont);
        studentName.setAlignment(Element.ALIGN_CENTER);
        studentName.setSpacingAfter(15);
        document.add(studentName);
        
        // Recognition Text
        Paragraph recognition = new Paragraph("in recognition of their active participation and valuable contribution to the", normalFont);
        recognition.setAlignment(Element.ALIGN_CENTER);
        recognition.setSpacingAfter(15);
        document.add(recognition);
        
        // Event Name
        Paragraph eventName = new Paragraph(event.getTitle(), eventFont);
        eventName.setAlignment(Element.ALIGN_CENTER);
        eventName.setSpacingAfter(10);
        document.add(eventName);
        
        // Event Date
        String eventDate = event.getStartDate().format(DATE_FORMATTER) + " - " + event.getEndDate().format(DATE_FORMATTER);
        Paragraph datePara = new Paragraph("held on " + eventDate, normalFont);
        datePara.setAlignment(Element.ALIGN_CENTER);
        datePara.setSpacingAfter(20);
        document.add(datePara);
        
        // Grade (if available)
        if (registration.getGrade() != null && !registration.getGrade().isEmpty()) {
            Paragraph gradePara = new Paragraph("Achieved Grade: " + registration.getGrade(), boldFont);
            gradePara.setAlignment(Element.ALIGN_CENTER);
            gradePara.setSpacingAfter(30);
            document.add(gradePara);
        } else {
            document.add(new Paragraph(" "));
        }
        
        // Signatures Table
        PdfPTable signatureTable = new PdfPTable(2);
        signatureTable.setWidthPercentage(70);
        signatureTable.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setPaddingTop(30);
        leftCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph signLine1 = new Paragraph("_________________________", normalFont);
        signLine1.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(signLine1);
        
        Paragraph signName1 = new Paragraph("Authorized Signatory", boldFont);
        signName1.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(signName1);
        
        Paragraph signTitle1 = new Paragraph("Department of Education", normalFont);
        signTitle1.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(signTitle1);
        
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setPaddingTop(30);
        rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph signLine2 = new Paragraph("_________________________", normalFont);
        signLine2.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(signLine2);
        
        Paragraph signName2 = new Paragraph("Principal", boldFont);
        signName2.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(signName2);
        
        Paragraph signTitle2 = new Paragraph(event.getInstitution().getName(), normalFont);
        signTitle2.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(signTitle2);
        
        signatureTable.addCell(leftCell);
        signatureTable.addCell(rightCell);
        document.add(signatureTable);
        
        // Certificate ID Footer
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph("Certificate ID: " + certificateId + "  |  ✓ Verified", normalFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(20);
        document.add(footer);
        
        document.close();
        
        System.out.println("Certificate saved successfully at: " + filePath);
        
        return webPath;
    }
    
    private String generateCertificateId(Event event, User student) {
        int year = event.getStartDate().getYear();
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("CERT-%d-%d-%d-%s", year, event.getId(), student.getId(), random);
    }
    
    public Optional<Certificate> getCertificateById(Long certificateId) {
        return certificateRepository.findById(certificateId);
    }
    
    public Optional<Certificate> getCertificateByUniqueId(String uniqueId) {
        return certificateRepository.findByCertificateUniqueId(uniqueId);
    }
    
    public List<Certificate> getCertificatesByStudent(User student) {
        return certificateRepository.findByStudent(student);
    }
    
    public List<Certificate> getCertificatesByEvent(Event event) {
        return certificateRepository.findByEvent(event);
    }
    
    public byte[] getCertificateFile(Certificate certificate) throws IOException {
        // Debug logging
        System.out.println("=== DOWNLOAD DEBUG ===");
        System.out.println("Certificate ID: " + certificate.getId());
        System.out.println("Certificate URL from DB: " + certificate.getCertificateUrl());
        System.out.println("Storage Path from properties: " + storagePath);
        
        // Get filename from URL
        String filename = certificate.getCertificateUrl().replace("/certificates/", "");
        System.out.println("Filename: " + filename);
        
        // Get project root directory
        String projectRoot = System.getProperty("user.dir");
        
        // Try multiple possible paths
        List<String> possiblePaths = Arrays.asList(
            projectRoot + File.separator + storagePath + File.separator + filename,
            projectRoot + File.separator + "certificates" + File.separator + filename,
            storagePath + File.separator + filename
        );
        
        File file = null;
        for (String path : possiblePaths) {
            File testFile = new File(path);
            System.out.println("Checking path: " + path);
            if (testFile.exists()) {
                file = testFile;
                System.out.println("✅ File found at: " + path);
                break;
            }
        }
        
        if (file == null || !file.exists()) {
            System.err.println("❌ Certificate file not found for ID: " + certificate.getId());
            throw new IOException("Certificate file not found. Looked in: " + possiblePaths);
        }
        
        System.out.println("File size: " + file.length() + " bytes");
        return java.nio.file.Files.readAllBytes(file.toPath());
    }
    
    public boolean verifyCertificate(String certificateUniqueId) {
        Optional<Certificate> certificate = certificateRepository.findByCertificateUniqueId(certificateUniqueId);
        return certificate.isPresent() && certificate.get().getIsVerified();
    }
}