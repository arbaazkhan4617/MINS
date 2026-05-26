package com.mins.auth;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInMinutes
) {
}
