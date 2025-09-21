package com.ai.dictionary.word.controller;

import com.ai.dictionary.word.dto.WordRequest;
import com.ai.dictionary.word.dto.WordResponse;
import com.ai.dictionary.word.model.Word;
import com.ai.dictionary.word.repository.WordRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordRepository repo;

    public WordController(WordRepository repo) {
        this.repo = repo;
    }

    // List only the current user's words
    @GetMapping
    public List<Word> listMyWords(Principal principal) {
        return repo.findAllByCreatedBy(principal.getName());
    }

    // Create a word owned by current user
    @PostMapping
    public WordResponse create(@Valid @RequestBody WordRequest req, Principal principal) {
        Word w = new Word();
        w.setText(req.getText());
        w.setDefinition(req.getDefinition());
        w.setCreatedBy(principal.getName());
        w = repo.save(w);
        return new WordResponse(w.getId(), w.getText(), w.getDefinition(), w.getCreatedBy());
    }

    // Update a word ONLY if owned by current user
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

    // Delete a word ONLY if owned by current user
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) {
        Word w = repo.findByIdAndCreatedBy(id, principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Word not found or not yours"));
        repo.delete(w);
    }

    // Simple 404 exception for clarity
    @ResponseStatus(org.springframework.http.HttpStatus.NOT_FOUND)
    static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String msg) {
            super(msg);
        }
    }
}
