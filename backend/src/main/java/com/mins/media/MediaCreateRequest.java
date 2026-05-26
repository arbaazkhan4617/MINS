package com.mins.media;

import jakarta.validation.constraints.NotBlank;

public record MediaCreateRequest(
        @NotBlank String title,
        @NotBlank String category,
        @NotBlank String subCategory,
        @NotBlank String type,
        @NotBlank String url
) {
}
