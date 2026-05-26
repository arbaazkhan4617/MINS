package com.mins.contact;

import jakarta.validation.constraints.NotBlank;

public record ContactStatusRequest(@NotBlank String status) {
}
