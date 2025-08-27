package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.PostRepository;
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
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(
            @RequestParam("caption") String caption,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile image,
            Authentication authentication 
    ) {
        try {
            // Check if user is authenticated
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            User currentUser = (User) authentication.getPrincipal();
            
            // Validate input
            if (caption == null || caption.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Caption is required");
            }
            
            if (location == null || location.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Location is required");
            }
            
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body("Image is required");
            }
            
            // Check file size (5MB limit)
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size too large. Maximum 5MB allowed.");
            }
            
            // Check file type
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }
            
            // Store file and get filename
            String fileName = fileStorageService.storeFile(image);
            
            // Create post entity
            Post post = new Post();
            post.setCaption(caption.trim());
            post.setLocation(location.trim());
            post.setImagePath(fileName); // Store filename instead of bytes
            post.setOriginalFileName(image.getOriginalFilename());
            post.setUser(currentUser);
            
            Post savedPost = postRepository.save(post);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedPost.getId());
            response.put("caption", savedPost.getCaption());
            response.put("location", savedPost.getLocation());
            response.put("imagePath", savedPost.getImagePath());
            response.put("originalFileName", savedPost.getOriginalFileName());
            response.put("createdAt", savedPost.getCreatedAt());
            response.put("userId", savedPost.getUser().getId());
            response.put("message", "Post uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error storing file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading post: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllPosts() {
        try {
            List<Post> posts = postRepository.findAll();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching posts: " + e.getMessage());
        }
    }
    
    // New endpoint to serve images
    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "image/jpeg"; // default
                if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (fileName.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Post post = postRepository.findById(postId).orElse(null);
            
            if (post == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Check if current user owns this post
            if (!post.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("You can only delete your own posts");
            }
            
            // Delete the image file
            if (post.getImagePath() != null) {
                fileStorageService.deleteFile(post.getImagePath());
            }
            
            // Delete the post from database
            postRepository.delete(post);
            
            return ResponseEntity.ok("Post deleted successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting post: " + e.getMessage());
        }
    }
}