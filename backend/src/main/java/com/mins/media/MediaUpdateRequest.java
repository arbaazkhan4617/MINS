package com.mins.media;

import jakarta.validation.constraints.NotBlank;

public record MediaUpdateRequest(
        @NotBlank String title,
        @NotBlank String category,
        @NotBlank String subCategory
) {
}
