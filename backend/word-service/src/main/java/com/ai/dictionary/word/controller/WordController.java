package com.ai.dictionary.word.controller;

import com.ai.dictionary.word.dto.WordRequest;
import com.ai.dictionary.word.dto.WordResponse;
import com.ai.dictionary.word.model.Word;
import com.ai.dictionary.word.repository.WordRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordRepository repo;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public WordController(WordRepository repo, KafkaTemplate<String, String> kafkaTemplate) {
        this.repo = repo;
        this.kafkaTemplate = kafkaTemplate;
    }

    // 🔹 List only the current user's words
    @GetMapping
    public List<Word> listMyWords(Principal principal) {
        return repo.findAllByCreatedBy(principal.getName());
    }

    // 🔹 Create a word (definition will be added later by AI Service)
    @PostMapping
    public WordResponse create(@Valid @RequestBody WordRequest req, Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthorized: You must login first.");
        }

        String username = principal.getName(); // ✅ always the JWT user

        Word w = new Word();
        w.setText(req.getText());
        w.setCreatedBy(username);
        w = repo.save(w);

        String event = w.getId() + ":" + w.getText() + ":" + w.getCreatedBy();
        kafkaTemplate.send("words", event);

        return new WordResponse(w.getId(), w.getText(), w.getDefinition(), w.getCreatedBy());
    }

    // 🔹 Update a word (if owned by current user)
    @PutMapping("/{id}")
    public WordResponse update(@PathVariable Long id,
            @Valid @RequestBody WordRequest req,
            Principal principal) {
        Word w = repo.findByIdAndCreatedBy(id, principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Word not found or not yours"));

        w.setText(req.getText());
        w.setDefinition(req.getDefinition());
        repo.save(w);
        return new WordResponse(w.getId(), w.getText(), w.getDefinition(), w.getCreatedBy());
    }

    // 🔹 Delete a word (if owned by current user)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) {
        Word w = repo.findByIdAndCreatedBy(id, principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Word not found or not yours"));
        repo.delete(w);
    }

    // 🔹 Endpoint for AI Service to update definition by ID
    @PutMapping(path = "/{id}/definition", consumes = "text/plain")
    public ResponseEntity<?> updateDefinition(@PathVariable Long id, @RequestBody String definition) {
        return repo.findById(id)
                .map(word -> {
                    word.setDefinition(definition);
                    repo.save(word);
                    return ResponseEntity.ok("Definition updated");
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("{\"error\":\"Word not found\"}"));
    }

    // Simple 404 exception
    @ResponseStatus(org.springframework.http.HttpStatus.NOT_FOUND)
    static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String msg) {
            super(msg);
        }
    }
}
