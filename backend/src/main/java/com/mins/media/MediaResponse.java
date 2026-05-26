package com.mins.media;

import java.time.Instant;

public record MediaResponse(
        long id,
        String title,
        String category,
        String subCategory,
        String type,
        String url,
        Instant uploadedAt
) {
}
