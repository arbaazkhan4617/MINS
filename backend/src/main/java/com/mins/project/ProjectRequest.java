package com.mins.project;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank String title,
        @NotBlank String category,
        @NotBlank String summary,
        @NotBlank String imageUrl,
        String description
) {
}
