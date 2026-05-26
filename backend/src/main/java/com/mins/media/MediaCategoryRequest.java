package com.mins.media;

import jakarta.validation.constraints.NotBlank;

public record MediaCategoryRequest(
        @NotBlank String name,
        boolean active
) {
}
