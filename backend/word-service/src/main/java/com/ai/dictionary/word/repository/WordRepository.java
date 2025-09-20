package com.ai.dictionary.word.repository;

import com.ai.dictionary.word.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// JPA repository for CRUD operations on Word entity
public interface WordRepository extends JpaRepository<Word, Long> {
    // Custom method: find all words by user who created them
    List<Word> findByCreatedBy(String createdBy);

}
