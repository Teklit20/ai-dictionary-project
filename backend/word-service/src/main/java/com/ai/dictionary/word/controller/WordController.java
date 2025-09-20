package com.ai.dictionary.word.controller;

import com.ai.dictionary.word.model.Word;
import com.ai.dictionary.word.repository.WordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
// REST controller for managing words
@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordRepository wordRepository;

    public WordController(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    // Add new word
    @PostMapping
    public ResponseEntity<Word> addWord(@RequestBody Word word, Authentication authentication) {
        // authentication.getName() returns username from JWT
        word.setCreatedBy(authentication.getName());
        return ResponseEntity.ok(wordRepository.save(word));
    }

    // List all words of current user
    @GetMapping
    public ResponseEntity<List<Word>> getWords(Authentication authentication) {
        return ResponseEntity.ok(wordRepository.findByCreatedBy(authentication.getName()));
    }

    // Get word by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getWord(@PathVariable Long id, Authentication authentication) {
        Optional<Word> word = wordRepository.findById(id);
        if (word.isPresent() && word.get().getCreatedBy().equals(authentication.getName())) {
            return ResponseEntity.ok(word.get());
        }
        return ResponseEntity.status(403).body("Not authorized or word not found");
    }

    // Delete word
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWord(@PathVariable Long id, Authentication authentication) {
        Optional<Word> word = wordRepository.findById(id);
        if (word.isPresent() && word.get().getCreatedBy().equals(authentication.getName())) {
            wordRepository.delete(word.get());
            return ResponseEntity.ok("Deleted");
        }
        return ResponseEntity.status(403).body("Not authorized or word not found");
    }
}
