package com.mins.career;

import java.time.Instant;

public record CareerApplicationResponse(
        long id,
        String name,
        String email,
        String phone,
        String position,
        String message,
        String resumeUrl,
        String status,
        Instant createdAt
) {
}
