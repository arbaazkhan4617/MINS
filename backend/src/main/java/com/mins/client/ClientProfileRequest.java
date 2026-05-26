package com.mins.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientProfileRequest(
        @NotBlank String name,
        @NotBlank String role,
        @NotBlank String company,
        @NotBlank String quote,
        @NotBlank String photoUrl,
        @NotNull Integer displayOrder
) {
}
