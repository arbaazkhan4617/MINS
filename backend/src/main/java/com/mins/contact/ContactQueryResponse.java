package com.mins.contact;

import java.time.Instant;

public record ContactQueryResponse(
        long id,
        String name,
        String email,
        String phone,
        String message,
        String status,
        Instant createdAt
) {
}
