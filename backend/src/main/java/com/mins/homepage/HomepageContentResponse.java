package com.mins.homepage;

import java.time.Instant;
import java.util.List;

public record HomepageContentResponse(
        String heroHeadline,
        String heroSubheading,
        String heroMediaSrc,
        String heroMediaType,
        String ctaTitle,
        List<String> stats,
        Instant updatedAt
) {
}
