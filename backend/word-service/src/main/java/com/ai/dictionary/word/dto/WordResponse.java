package com.ai.dictionary.word.dto;

public class WordResponse {
    private Long id;
    private String text;
    private String definition;
    private String createdBy;

    public WordResponse(Long id, String text, String definition, String createdBy) {
        this.id = id;
        this.text = text;
        this.definition = definition;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getDefinition() {
        return definition;
    }

    public String getCreatedBy() {
        return createdBy;
    }
}
