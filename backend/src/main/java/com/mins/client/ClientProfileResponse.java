package com.mins.client;

import java.time.Instant;

public record ClientProfileResponse(
        long id,
        String name,
        String role,
        String company,
        String quote,
        String photoUrl,
        Integer displayOrder,
        Instant createdAt,
        Instant updatedAt
) {
}
