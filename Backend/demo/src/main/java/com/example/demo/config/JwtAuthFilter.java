package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.userRepository;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private userRepository userRepository;  

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                String email = jwtUtil.extractEmail(jwt);

                if (email != null && jwtUtil.validateToken(jwt, email)) {
                	User user = userRepository.findByEmail(email);

                	if (user != null && jwtUtil.validateToken(jwt, email)) {
                	    UsernamePasswordAuthenticationToken authentication =
                	            new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                	    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                	    SecurityContextHolder.getContext().setAuthentication(authentication);
                	}


                }
            } catch (Exception e) {
                System.out.println("JWT parsing error: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
