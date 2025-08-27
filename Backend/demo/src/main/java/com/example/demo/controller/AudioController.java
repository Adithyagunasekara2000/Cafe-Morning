package com.example.demo.controller;

import com.example.demo.model.Audio;
import com.example.demo.model.User;
import com.example.demo.repository.AudioRepository;
import com.example.demo.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audio")
public class AudioController {
    
    @Autowired
    private AudioRepository audioRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAudio(
            @RequestParam("caption") String caption,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestParam(value = "artistName", required = false) String artistName,
            @RequestParam("audio") MultipartFile audioFile,
            Authentication authentication 
    ) {
        try {
            
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            User currentUser = (User) authentication.getPrincipal();
            
            
            if (caption == null || caption.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Caption is required");
            }
            
            if (audioFile == null || audioFile.isEmpty()) {
                return ResponseEntity.badRequest().body("Audio file is required");
            }
            
           
            if (audioFile.getSize() > 50 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("Audio file size too large. Maximum 50MB allowed.");
            }
            
            // Validate audio file type
            if (!fileStorageService.isValidAudioFile(audioFile)) {
                return ResponseEntity.badRequest().body("Invalid audio format. Supported: MP3, WAV, OGG, M4A, AAC, FLAC, WMA");
            }
            
            // Store audio file
            String audioFileName = fileStorageService.storeFile(audioFile, "audio");
            
            // Create audio entity
            Audio audio = new Audio();
            audio.setCaption(caption.trim());
            audio.setGenre(genre != null ? genre.trim() : null);
            audio.setArtistName(artistName != null ? artistName.trim() : null);
            audio.setAudioPath(audioFileName);
            audio.setOriginalFileName(audioFile.getOriginalFilename());
            audio.setUser(currentUser);
            
            Audio savedAudio = audioRepository.save(audio);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedAudio.getId());
            response.put("caption", savedAudio.getCaption());
            response.put("genre", savedAudio.getGenre());
            response.put("artistName", savedAudio.getArtistName());
            response.put("audioPath", savedAudio.getAudioPath());
            response.put("originalFileName", savedAudio.getOriginalFileName());
            response.put("createdAt", savedAudio.getCreatedAt());
            response.put("userId", savedAudio.getUser().getId());
            response.put("message", "Audio uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error storing audio file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading audio: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllAudio() {
        try {
            List<Audio> audioList = audioRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(audioList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching audio: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-audio")
    public ResponseEntity<?> getMyAudio(Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            List<Audio> audioList = audioRepository.findByUserId(currentUser.getId());
            return ResponseEntity.ok(audioList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching your audio: " + e.getMessage());
        }
    }
    
    @GetMapping("/genre/{genre}")
    public ResponseEntity<?> getAudioByGenre(@PathVariable String genre) {
        try {
            List<Audio> audioList = audioRepository.findByGenreContainingIgnoreCase(genre);
            return ResponseEntity.ok(audioList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching audio by genre: " + e.getMessage());
        }
    }
    
    @GetMapping("/artist/{artistName}")
    public ResponseEntity<?> getAudioByArtist(@PathVariable String artistName) {
        try {
            List<Audio> audioList = audioRepository.findByArtistNameContainingIgnoreCase(artistName);
            return ResponseEntity.ok(audioList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching audio by artist: " + e.getMessage());
        }
    }
    
    // Endpoint to stream/download audio files
    @GetMapping("/play/{fileName:.+}")
    public ResponseEntity<Resource> playAudio(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath("audio/" + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineAudioContentType(fileName);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600") // Cache for 1 hour
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{audioId}")
    public ResponseEntity<?> deleteAudio(@PathVariable Long audioId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Audio audio = audioRepository.findById(audioId).orElse(null);
            
            if (audio == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Check if current user owns this audio
            if (!audio.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("You can only delete your own audio");
            }
            
            // Delete the audio file from storage
            if (audio.getAudioPath() != null) {
                fileStorageService.deleteFile(audio.getAudioPath());
            }
            
            // Delete the audio record from database
            audioRepository.delete(audio);
            
            return ResponseEntity.ok("Audio deleted successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting audio: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchAudio(@RequestParam String query) {
        try {
            List<Audio> audioList = audioRepository.findByCaptionContainingIgnoreCase(query);
            return ResponseEntity.ok(audioList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error searching audio: " + e.getMessage());
        }
    }
    
    private String determineAudioContentType(String fileName) {
        String lowerFileName = fileName.toLowerCase();
        
        if (lowerFileName.endsWith(".mp3")) return "audio/mpeg";
        if (lowerFileName.endsWith(".wav")) return "audio/wav";
        if (lowerFileName.endsWith(".ogg")) return "audio/ogg";
        if (lowerFileName.endsWith(".m4a")) return "audio/mp4";
        if (lowerFileName.endsWith(".aac")) return "audio/aac";
        if (lowerFileName.endsWith(".flac")) return "audio/flac";
        if (lowerFileName.endsWith(".wma")) return "audio/x-ms-wma";
        
        return "audio/mpeg"; // default to mp3
    }
}