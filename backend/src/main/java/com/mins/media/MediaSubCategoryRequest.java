package com.mins.media;

import jakarta.validation.constraints.NotBlank;

public record MediaSubCategoryRequest(
        @NotBlank String category,
        @NotBlank String name,
        boolean active
) {
}
