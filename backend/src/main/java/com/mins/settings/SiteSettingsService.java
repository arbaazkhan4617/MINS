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
        settings.setCompanyName("S S Enterprises (MINS)");
        settings.setTagline("Building Trust Since 2007");
        settings.setLogoUrl("");
        settings.setEmail("info@ssenterprises.in");
        settings.setMobile("+91 82260 23925");
        settings.setWhatsappNumber("918226023925");
        settings.setLocation("APR Society, H No 40, Katanga Colony, Jabalpur, Madhya Pradesh 482001");
        settings.setMapEmbedUrl("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.0267784013444!2d79.9298585!3d23.169223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae17671fe25b%3A0x6bde3084346bbdbf!2sKatanga%2C%20Jabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin");
        settings.setWebsiteUrl("#");
        settings.setFacebookUrl("#");
        settings.setInstagramUrl("#");
        settings.setLinkedinUrl("#");
        settings.setXUrl("#");
        settings.setCopyrightText("Copyright (c) 2026 S S Enterprises (MINS). All rights reserved.");
        settings.setAboutEyebrow("About S S Enterprises");
        settings.setAboutTitle("A certified partner in safety, environmental stewardship, and sustainable resource extraction.");
        settings.setAboutContent("Established in 2007, S S Enterprises operates the Gosalpur Mine (39.44 Hectares) for manganese, iron ore, laterite, and ochre extraction. Certified for ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018, we deliver high-quality minerals under strict CPCB environmental guidelines.");
        settings.setAboutImageUrl("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85");
        settings.setDirectorMessage("At S S Enterprises, our goal is to build trust through quality work, dedicated service, and environmental compliance. We believe success comes from customer satisfaction, safety stewardship, and continuous improvement.");
        settings.setGstin("23AWWPS5673F2ZU");
        settings.setProprietor("Neeraj Shrivastava");
        settings.setMineSiteAddress("Khasra No. 160, 151, 123, 115, Village Gosalpur, Tehsil Sihora, Jabalpur, Madhya Pradesh 483222");
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
        settings.setGstin(request.gstin());
        settings.setProprietor(request.proprietor());
        settings.setMineSiteAddress(request.mineSiteAddress());
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
                settings.getGstin(),
                settings.getProprietor(),
                settings.getMineSiteAddress(),
                settings.getUpdatedAt()
        );
    }
}
