package com.ai.dictionary.word.repository;

import com.ai.dictionary.word.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<Word, Long> {

    // ✅ Get all words owned by a specific user
    List<Word> findAllByCreatedBy(String createdBy);

    // ✅ Find a single word by id + owner (for update/delete)
    Optional<Word> findByIdAndCreatedBy(Long id, String createdBy);
}
