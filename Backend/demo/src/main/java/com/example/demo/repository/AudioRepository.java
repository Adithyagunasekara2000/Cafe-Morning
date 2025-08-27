package com.example.demo.repository;

import com.example.demo.model.Audio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AudioRepository extends JpaRepository<Audio, Long> {
    
   
    List<Audio> findByUserId(Long userId);
    
  
    List<Audio> findByGenreContainingIgnoreCase(String genre);
    
    
    List<Audio> findByArtistNameContainingIgnoreCase(String artistName);
    
    
    List<Audio> findByCaptionContainingIgnoreCase(String caption);
    
   
    List<Audio> findAllByOrderByCreatedAtDesc();
}