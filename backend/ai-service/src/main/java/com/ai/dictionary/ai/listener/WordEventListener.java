package com.ai.dictionary.ai.listener;

import com.ai.dictionary.ai.config.OpenAiProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WordEventListener {

    private final RestTemplate restTemplate = new RestTemplate();
    private final OpenAiProperties openAi;

    public WordEventListener(OpenAiProperties openAi) {
        this.openAi = openAi;
    }

    // ✅ Listen for word events from Kafka
    @KafkaListener(topics = "words", groupId = "ai-service-group")
    public void consumeWordEvent(String message) {
        try {
            System.out.println("kafka Consumed word event: " + message);

            // Format: id:text:username
            String[] parts = message.split(":");
            Long id = Long.parseLong(parts[0]);
            String word = parts[1];

            // ✅ Fetch definition from ChatGPT
            // String definition = "This is the dummy definition hard coded";
            String definition = fetchDefinition(word);

            System.out.println("📖 Definition fetched: " + definition);

            // ✅ Update Word Service (MUST be PUT, not POST!)
            String url = "http://localhost:8082/api/words/" + id + "/definition";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> entity = new HttpEntity<>(definition, headers);
            restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);

            System.out.println("✅ Definition updated successfully for word: " + word);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Failed to process word event: " + message);
        }
    }

    // ✅ Ask ChatGPT for definition
    private String fetchDefinition(String word) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAi.getKey());

        // System.out.println(" ===\n Tthis is the open api key fetched : " +
        // openAi.getKey() + "==== \n");
        String body = """
                {
                  "model": "gpt-4o-mini",
                  "messages": [
                    {"role": "system", "content": "You are a helpful dictionary."},
                    {"role": "user", "content": "Define the word '%s' in simple English. Keep it to one or two sentences."}
                  ],
                  "max_tokens": 120
                }
                """
                .formatted(word);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            String response = restTemplate.postForObject(openAi.getUrl(), request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Definition not found";
        }
    }
}
