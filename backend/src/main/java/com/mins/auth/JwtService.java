package com.mins.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
public class JwtService {

    private final ObjectMapper objectMapper;
    private final String issuer;
    private final String secret;
    private final long expirationMinutes;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.objectMapper = objectMapper;
        this.issuer = issuer;
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String createToken(String subject) {
        long now = Instant.now().getEpochSecond();
        long expiresAt = now + (expirationMinutes * 60);

        String header = encodeJson(Map.of("alg", "HS256", "typ", "JWT"));
        String payload = encodeJson(Map.of(
                "sub", subject,
                "iss", issuer,
                "iat", now,
                "exp", expiresAt,
                "role", "ADMIN"
        ));
        String unsignedToken = header + "." + payload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public boolean isValid(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }

            String unsignedToken = parts[0] + "." + parts[1];
            if (!sign(unsignedToken).equals(parts[2])) {
                return false;
            }

            Map<?, ?> payload = objectMapper.readValue(
                    Base64.getUrlDecoder().decode(parts[1]),
                    Map.class
            );
            Number exp = (Number) payload.get("exp");
            String tokenIssuer = (String) payload.get("iss");

            return issuer.equals(tokenIssuer) && exp.longValue() > Instant.now().getEpochSecond();
        } catch (Exception ignored) {
            return false;
        }
    }

    public String subject(String token) {
        try {
            String[] parts = token.split("\\.");
            Map<?, ?> payload = objectMapper.readValue(
                    Base64.getUrlDecoder().decode(parts[1]),
                    Map.class
            );
            return (String) payload.get("sub");
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid JWT token", exception);
        }
    }

    public long expirationMinutes() {
        return expirationMinutes;
    }

    private String encodeJson(Map<String, ?> value) {
        try {
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to create JWT payload", exception);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to sign JWT token", exception);
        }
    }
}
