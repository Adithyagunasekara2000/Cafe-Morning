package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    // Supported audio formats
    private static final List<String> SUPPORTED_AUDIO_TYPES = Arrays.asList(
        "audio/mpeg",        
        "audio/wav",         
        "audio/ogg",         
        "audio/mp4",         
        "audio/aac",         
        "audio/flac",        
        "audio/x-ms-wma"     
    );
    
    // Supported image formats
    private static final List<String> SUPPORTED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/gif",
        "image/webp"
    );
    
    public String storeFile(MultipartFile file, String subDirectory) throws IOException {
      
        Path uploadPath = Paths.get(uploadDir, subDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
       
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
      
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        Path targetLocation = uploadPath.resolve(uniqueFileName);
        
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return subDirectory + "/" + uniqueFileName; 
    }
    
   
    public String storeFile(MultipartFile file) throws IOException {
        return storeFile(file, "images");
    }
    
    public boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && SUPPORTED_IMAGE_TYPES.contains(contentType.toLowerCase());
    }
    
    public boolean isValidAudioFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && SUPPORTED_AUDIO_TYPES.contains(contentType.toLowerCase());
    }
    
    public void deleteFile(String filePath) {
        try {
            Path fullPath = Paths.get(uploadDir).resolve(filePath);
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + filePath + " - " + e.getMessage());
        }
    }
    
    public Path getFilePath(String filePath) {
        return Paths.get(uploadDir).resolve(filePath);
    }
}