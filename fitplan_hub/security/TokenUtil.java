package com.fitplanhub.security;

import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.UUID;

@Component
public class TokenUtil {

    public String generateToken(String email) {
        String raw = email + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(raw.getBytes());
    }

    public String extractEmail(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            return decoded.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }
}
