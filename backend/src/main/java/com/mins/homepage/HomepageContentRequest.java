package com.mins.homepage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record HomepageContentRequest(
        @NotBlank String heroHeadline,
        @NotBlank String heroSubheading,
        @NotBlank String heroMediaSrc,
        @NotBlank String heroMediaType,
        @NotBlank String ctaTitle,
        @Size(min = 4, max = 4) List<@NotBlank String> stats
) {
}
