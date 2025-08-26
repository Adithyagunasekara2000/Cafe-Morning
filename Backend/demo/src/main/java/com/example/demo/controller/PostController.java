package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.userRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(
            @RequestParam("caption") String caption,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile image,
            Authentication authentication 
    ) throws IOException {

        User currentUser = (User) authentication.getPrincipal();

        Post post = new Post();
        post.setCaption(caption);
        post.setLocation(location);
        post.setImage(image.getBytes()); 
        post.setUser(currentUser);

        Post savedPost = postRepository.save(post);

        return ResponseEntity.ok(savedPost);
    }
}
