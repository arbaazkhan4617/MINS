package com.mins.media;

public record MediaSubCategoryResponse(
        Long id,
        String category,
        String name,
        boolean active
) {
}
