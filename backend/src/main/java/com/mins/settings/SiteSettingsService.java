package com.mins.settings;

import com.mins.common.UploadStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class SiteSettingsService {

    private static final long SETTINGS_ID = 1L;

    private final SiteSettingsRepository siteSettingsRepository;
    private final UploadStorageService uploadStorageService;

    public SiteSettingsService(
            SiteSettingsRepository siteSettingsRepository,
            UploadStorageService uploadStorageService
    ) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.uploadStorageService = uploadStorageService;
    }

    @PostConstruct
    public void seedDefaults() {
        if (!siteSettingsRepository.existsById(SETTINGS_ID)) {
            siteSettingsRepository.save(defaultSettings());
        }
    }

    public SiteSettingsResponse find() {
        return toResponse(getSettings());
    }

    public SiteSettingsResponse update(SiteSettingsRequest request) {
        SiteSettings settings = getSettings();
        apply(settings, request);
        settings.setUpdatedAt(Instant.now());
        return toResponse(siteSettingsRepository.save(settings));
    }

    public SiteUploadResponse upload(MultipartFile file) {
        return new SiteUploadResponse(uploadStorageService.store(file));
    }

    private SiteSettings getSettings() {
        return siteSettingsRepository.findById(SETTINGS_ID)
                .orElseGet(() -> siteSettingsRepository.save(defaultSettings()));
    }

    private SiteSettings defaultSettings() {
        SiteSettings settings = new SiteSettings(SETTINGS_ID);
        settings.setCompanyName("MINS");
        settings.setTagline("Since 2007");
        settings.setLogoUrl("");
        settings.setEmail("info@mins.example");
        settings.setMobile("+91 98765 43210");
        settings.setWhatsappNumber("919876543210");
        settings.setLocation("MP Nagar, Bhopal, Madhya Pradesh");
        settings.setMapEmbedUrl("https://www.google.com/maps?q=MP%20Nagar%2C%20Bhopal&output=embed");
        settings.setWebsiteUrl("#");
        settings.setFacebookUrl("#");
        settings.setInstagramUrl("#");
        settings.setLinkedinUrl("#");
        settings.setXUrl("#");
        settings.setCopyrightText("Copyright (c) 2026 MINS. All rights reserved.");
        settings.setAboutEyebrow("About MINS");
        settings.setAboutTitle("A dependable corporate partner focused on long-term value.");
        settings.setAboutContent("MINS combines practical business experience, careful execution, and customer-first thinking to deliver services with consistency and trust.");
        settings.setAboutImageUrl("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85");
        settings.setDirectorMessage("Our focus is simple: understand the client, communicate clearly, deliver responsibly, and keep improving. MINS is committed to growing with professionalism, humility, and dependable service.");
        settings.setUpdatedAt(Instant.now());
        return settings;
    }

    private void apply(SiteSettings settings, SiteSettingsRequest request) {
        settings.setCompanyName(request.companyName());
        settings.setTagline(request.tagline());
        settings.setLogoUrl(request.logoUrl());
        settings.setEmail(request.email());
        settings.setMobile(request.mobile());
        settings.setWhatsappNumber(request.whatsappNumber());
        settings.setLocation(request.location());
        settings.setMapEmbedUrl(request.mapEmbedUrl());
        settings.setWebsiteUrl(valueOrHash(request.websiteUrl()));
        settings.setFacebookUrl(valueOrHash(request.facebookUrl()));
        settings.setInstagramUrl(valueOrHash(request.instagramUrl()));
        settings.setLinkedinUrl(valueOrHash(request.linkedinUrl()));
        settings.setXUrl(valueOrHash(request.xUrl()));
        settings.setCopyrightText(request.copyrightText());
        settings.setAboutEyebrow(request.aboutEyebrow());
        settings.setAboutTitle(request.aboutTitle());
        settings.setAboutContent(request.aboutContent());
        settings.setAboutImageUrl(request.aboutImageUrl());
        settings.setDirectorMessage(request.directorMessage());
    }

    private String valueOrHash(String value) {
        return value == null || value.isBlank() ? "#" : value;
    }

    private SiteSettingsResponse toResponse(SiteSettings settings) {
        return new SiteSettingsResponse(
                settings.getCompanyName(),
                settings.getTagline(),
                settings.getLogoUrl(),
                settings.getEmail(),
                settings.getMobile(),
                settings.getWhatsappNumber(),
                settings.getLocation(),
                settings.getMapEmbedUrl(),
                settings.getWebsiteUrl(),
                settings.getFacebookUrl(),
                settings.getInstagramUrl(),
                settings.getLinkedinUrl(),
                settings.getXUrl(),
                settings.getCopyrightText(),
                settings.getAboutEyebrow(),
                settings.getAboutTitle(),
                settings.getAboutContent(),
                settings.getAboutImageUrl(),
                settings.getDirectorMessage(),
                settings.getUpdatedAt()
        );
    }
}
