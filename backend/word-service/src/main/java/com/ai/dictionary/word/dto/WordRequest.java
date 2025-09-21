package com.ai.dictionary.word.dto;

import jakarta.validation.constraints.NotBlank;

public class WordRequest {
    @NotBlank(message = "text is required") // ensure non-empty
    private String text;

    private String definition; // optional

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }
}
