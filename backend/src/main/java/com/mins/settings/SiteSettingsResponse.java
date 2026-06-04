package com.mins.settings;

public record SiteSettingsResponse(
        String companyName,
        String tagline,
        String logoUrl,
        String email,
        String mobile,
        String whatsappNumber,
        String location,
        String mapEmbedUrl,
        String websiteUrl,
        String facebookUrl,
        String instagramUrl,
        String linkedinUrl,
        String xUrl,
        String copyrightText,
        String aboutEyebrow,
        String aboutTitle,
        String aboutContent,
        String aboutImageUrl,
        String directorMessage,
        String gstin,
        String proprietor,
        String mineSiteAddress,
        String updatedAt
) {
}
