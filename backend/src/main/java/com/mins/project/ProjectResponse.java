package com.mins.project;

import java.time.Instant;

public record ProjectResponse(
        long id,
        String title,
        String category,
        String summary,
        String imageUrl,
        String description,
        Instant createdAt
) {
}
