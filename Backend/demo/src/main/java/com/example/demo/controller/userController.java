package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.userRepository;

@RestController
@RequestMapping("/api/auth")
public class userController {

    @Autowired
    private userRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
      
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email already registered!");
        }

       
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
