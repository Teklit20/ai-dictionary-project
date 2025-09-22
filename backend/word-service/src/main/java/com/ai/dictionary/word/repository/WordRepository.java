package com.ai.dictionary.word.repository;

import com.ai.dictionary.word.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<Word, Long> {

    // Find all words owned by a specific user
    List<Word> findAllByCreatedBy(String createdBy);

    // Find a specific word owned by a user
    Optional<Word> findByIdAndCreatedBy(Long id, String createdBy);

    // ✅ Find a word by its text (needed for updateDefinition)
    Optional<Word> findByText(String text);
}
