package com.mins.settings;

import jakarta.validation.constraints.NotBlank;

public record SiteSettingsRequest(
        @NotBlank String companyName,
        @NotBlank String tagline,
        String logoUrl,
        @NotBlank String email,
        @NotBlank String mobile,
        @NotBlank String whatsappNumber,
        @NotBlank String location,
        @NotBlank String mapEmbedUrl,
        String websiteUrl,
        String facebookUrl,
        String instagramUrl,
        String linkedinUrl,
        String xUrl,
        @NotBlank String copyrightText,
        @NotBlank String aboutEyebrow,
        @NotBlank String aboutTitle,
        @NotBlank String aboutContent,
        @NotBlank String aboutImageUrl,
        @NotBlank String directorMessage,
        String gstin,
        String proprietor,
        @NotBlank String mineSiteAddress,
        @NotBlank String whyChooseUsJson,
        @NotBlank String coreValuesJson,
        @NotBlank String servicesJson,
        @NotBlank String futureGoalsJson,
        @NotBlank String strengthText,
        @NotBlank String commitmentText,
        @NotBlank String productsJson,
        @NotBlank String technicalSpecsJson,
        @NotBlank String safetyGuidelinesJson,
        @NotBlank String supplyTermsJson,
        @NotBlank String assetAllocationsJson,
        @NotBlank String registeredOfficeJson
) {
}
