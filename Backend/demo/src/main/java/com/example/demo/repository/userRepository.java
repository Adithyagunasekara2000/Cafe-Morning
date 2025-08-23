package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface userRepository extends JpaRepository<User, Integer> {
	boolean existsByEmail(String email);
	 User findByEmail(String email);
}
