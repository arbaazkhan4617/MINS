package com.mins.career;

import jakarta.validation.constraints.NotBlank;

public record CareerStatusRequest(
        @NotBlank String status
) {
}
