package com.ai.dictionary.word.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// Utility class for generating and validating JWT tokens
@Component
public class JwtUtil {
    private final String SECRET = "mysecretkeymysecretkeymysecretkey123"; // same secret as Auth Service
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour expiration

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Extract username from token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // use our secret key
                .build()
                .parseClaimsJws(token) // parse JWT
                .getBody()
                .getSubject(); // return "sub" field (username)
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true; // valid
        } catch (JwtException e) {
            return false; // invalid or expired
        }
    }
}
