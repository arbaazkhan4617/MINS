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
            UploadStorageService uploadStorageService) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.uploadStorageService = uploadStorageService;
    }

    @PostConstruct
    public void seedDefaults() {
        if (!siteSettingsRepository.existsById(SETTINGS_ID)) {
            siteSettingsRepository.save(defaultSettings());
        } else {
            SiteSettings settings = siteSettingsRepository.findById(SETTINGS_ID).orElseThrow();
            boolean dirty = false;
            if (settings.getWhyChooseUsJson() == null || settings.getWhyChooseUsJson().isBlank()) {
                settings.setWhyChooseUsJson(defaultSettings().getWhyChooseUsJson());
                dirty = true;
            }
            if (settings.getServicesJson() == null || settings.getServicesJson().isBlank()) {
                settings.setServicesJson(defaultSettings().getServicesJson());
                dirty = true;
            }
            if (settings.getCoreValuesJson() == null || settings.getCoreValuesJson().isBlank()) {
                settings.setCoreValuesJson(defaultSettings().getCoreValuesJson());
                dirty = true;
            }
            if (settings.getFutureGoalsJson() == null || settings.getFutureGoalsJson().isBlank()) {
                settings.setFutureGoalsJson(defaultSettings().getFutureGoalsJson());
                dirty = true;
            }
            if (settings.getStrengthText() == null || settings.getStrengthText().isBlank()) {
                settings.setStrengthText(defaultSettings().getStrengthText());
                dirty = true;
            }
            if (settings.getCommitmentText() == null || settings.getCommitmentText().isBlank()) {
                settings.setCommitmentText(defaultSettings().getCommitmentText());
                dirty = true;
            }
            if (settings.getProductsJson() == null || settings.getProductsJson().isBlank()) {
                settings.setProductsJson(defaultSettings().getProductsJson());
                dirty = true;
            }
            if (settings.getTechnicalSpecsJson() == null || settings.getTechnicalSpecsJson().isBlank()) {
                settings.setTechnicalSpecsJson(defaultSettings().getTechnicalSpecsJson());
                dirty = true;
            }
            if (settings.getSafetyGuidelinesJson() == null || settings.getSafetyGuidelinesJson().isBlank()) {
                settings.setSafetyGuidelinesJson(defaultSettings().getSafetyGuidelinesJson());
                dirty = true;
            }
            if (settings.getSupplyTermsJson() == null || settings.getSupplyTermsJson().isBlank()) {
                settings.setSupplyTermsJson(defaultSettings().getSupplyTermsJson());
                dirty = true;
            }
            if (settings.getAssetAllocationsJson() == null || settings.getAssetAllocationsJson().isBlank()) {
                settings.setAssetAllocationsJson(defaultSettings().getAssetAllocationsJson());
                dirty = true;
            }
            if (settings.getRegisteredOfficeJson() == null || settings.getRegisteredOfficeJson().isBlank()) {
                settings.setRegisteredOfficeJson(defaultSettings().getRegisteredOfficeJson());
                dirty = true;
            }
            if (dirty) {
                siteSettingsRepository.save(settings);
            }
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
        settings.setCompanyName("S S Enterprises (MINES)");
        settings.setTagline("Building Trust Since 2007");
        settings.setLogoUrl("");
        settings.setEmail("info@ssenterprises.in");
        settings.setMobile("+91 82260 23925");
        settings.setWhatsappNumber("918226023925");
        settings.setLocation("APR Society, H No 40, Katanga Colony, Jabalpur, Madhya Pradesh 482001");
        settings.setMapEmbedUrl(
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.0267784013444!2d79.9298585!3d23.169223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae17671fe25b%3A0x6bde3084346bbdbf!2sKatanga%2C%20Jabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin");
        settings.setWebsiteUrl("#");
        settings.setFacebookUrl("#");
        settings.setInstagramUrl("#");
        settings.setLinkedinUrl("#");
        settings.setXUrl("#");
        settings.setCopyrightText("Copyright (c) 2026 S S Enterprises (MINS). All rights reserved.");
        settings.setAboutEyebrow("About S S Enterprises");
        settings.setAboutTitle(
                "A certified partner in safety, environmental stewardship, and sustainable resource extraction.");
        settings.setAboutContent(
                "Established in 2007, S S Enterprises operates the Gosalpur Mine (39.44 Hectares) for manganese, iron ore, laterite, and ochre extraction. Certified for ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018, we deliver high-quality minerals under strict CPCB environmental guidelines.");
        settings.setAboutImageUrl(
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85");
        settings.setDirectorMessage(
                "At S S Enterprises, our goal is to build trust through quality work, dedicated service, and environmental compliance. We believe success comes from customer satisfaction, safety stewardship, and continuous improvement.");
        settings.setGstin("");
        settings.setProprietor("");
        settings.setMineSiteAddress(
                "Khasra No. 160, 151, 123, 115, Village Gosalpur, Tehsil Sihora, Jabalpur, Madhya Pradesh 483222");
        settings.setWhyChooseUsJson("[\n" +
                "  {\"title\": \"15+ Years of Experience\", \"text\": \"Continuous mineral operations, regional trust, and logistics experience since 2007.\"},\n"
                +
                "  {\"title\": \"Trusted & Professional Team\", \"text\": \"Led by experienced industry specialists, geologists, and managers.\"},\n"
                +
                "  {\"title\": \"Quality Service Assurance\", \"text\": \"Carefully mined manganese, laterite, iron ore, and ochre prepared to specifications.\"},\n"
                +
                "  {\"title\": \"Customer Satisfaction\", \"text\": \"Dedicated customer relationships and commitment to delivering excellence.\"},\n"
                +
                "  {\"title\": \"Timely Project Delivery\", \"text\": \"Structured transport and loading coordination with full dispatch documentation.\"},\n"
                +
                "  {\"title\": \"Transparent Business Ethics\", \"text\": \"Strict adherence to compliance, licensing, and professional business practices.\"}\n"
                +
                "]");
        settings.setServicesJson("[\n" +
                "  {\"title\": \"Trading Services\", \"text\": \"Reliable mining, sorting, and supply of manganese and iron ore from Gosalpur Lease.\"},\n"
                +
                "  {\"title\": \"Industrial Solutions\", \"text\": \"Consistent delivery of quality industrial laterite and ochre for regional manufacturers.\"},\n"
                +
                "  {\"title\": \"Business Consultancy\", \"text\": \"Consultancy for safety, environmental compliance, and resources stewardship.\"},\n"
                +
                "  {\"title\": \"Product Supply\", \"text\": \"High-grade mineral supply directly from extraction sites under certified quality protocols.\"},\n"
                +
                "  {\"title\": \"Marketing Services\", \"text\": \"Professional distribution, client relations, and market advisory for mineral products.\"},\n"
                +
                "  {\"title\": \"Customer Support\", \"text\": \"Dedicated dispatch, logistics coordination, and NABL-accredited reporting support.\"}\n"
                +
                "]");
        settings.setCoreValuesJson(
                "[\"Integrity\", \"Quality\", \"Commitment\", \"Innovation\", \"Customer First\", \"Teamwork\"]");
        settings.setFutureGoalsJson(
                "[\"Expand business nationwide\", \"Introduce innovative solutions\", \"Build stronger customer relationships\", \"Achieve sustainable growth\"]");
        settings.setStrengthText(
                "Our strength lies in our experienced team, strong customer relationships, and commitment to delivering excellence in every project.");
        settings.setCommitmentText(
                "We are committed to maintaining the highest standards of professionalism, reliability, and service excellence for every client.");
        settings.setProductsJson("[\n" +
                "  {\n" +
                "    \"id\": \"hematite-lumps-fines\",\n" +
                "    \"name\": \"High-Grade Hematite (Lumps & Fines)\",\n" +
                "    \"description\": \"Sized lumps and fines featuring excellent metallurgical properties, structural density, and high mechanical strength.\",\n" +
                "    \"variantName\": \"Hematite Lumps & Fines\",\n" +
                "    \"coaUrl\": \"\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": \"blue-dust\",\n" +
                "    \"name\": \"Blue Dust (Ultra-Fine Hematite)\",\n" +
                "    \"description\": \"A premium, naturally occurring friable form of hematite. It is chemically characterized by its exceptionally high iron (Fe) content, ultra-fine particle profile, and negligible chemical impurities.\",\n" +
                "    \"variantName\": \"Ultra-Fine Blue Dust\",\n" +
                "    \"coaUrl\": \"\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": \"manganese-ore\",\n" +
                "    \"name\": \"Manganese Ore\",\n" +
                "    \"description\": \"Vital alloying element critical for the production of ferroalloys, specialized stainless steel, and industrial chemical applications.\",\n" +
                "    \"variantName\": \"Industrial Manganese Ore\",\n" +
                "    \"coaUrl\": \"\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": \"laterite\",\n" +
                "    \"name\": \"Laterite\",\n" +
                "    \"description\": \"Extensively utilized as an essential chemical corrective component in cement clinker manufacturing and heavy infrastructure applications.\",\n" +
                "    \"variantName\": \"Cement Corrective Laterite\",\n" +
                "    \"coaUrl\": \"\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": \"ochre\",\n" +
                "    \"name\": \"Ochre\",\n" +
                "    \"description\": \"High-purity natural pigmenting agents processed for structural stability in the paint, coatings, plastics, and ceramics industries.\",\n" +
                "    \"variantName\": \"Natural Mineral Ochre\",\n" +
                "    \"coaUrl\": \"\"\n" +
                "  }\n" +
                "]");
        settings.setTechnicalSpecsJson("{\n" +
                "  \"description\": \"The physical and chemical configurations detailed below represent typical parameters for our core asset extractions. No fixed timelines apply. Exact contractual parameters are verified via independent lot certification at the point of loading.\",\n" +
                "  \"specificationsTable\": [\n" +
                "    {\"parameter\": \"Hematite Iron Ore Fe content\", \"value\": \"64% - 67% typical\"},\n" +
                "    {\"parameter\": \"Manganese Ore Mn content\", \"value\": \"28% - 46% typical\"},\n" +
                "    {\"parameter\": \"Laterite Fe2O3 content\", \"value\": \"Suitable for cement corrective\"},\n" +
                "    {\"parameter\": \"Ochre Fe2O3 content\", \"value\": \"High-purity natural pigment\"}\n" +
                "  ],\n" +
                "  \"secureLogistics\": \"Every bulk haulage unit carrying Blue Dust is securely sheeted with heavy-duty polymer tarpaulins, passing through high-impact wheel-and-chassis washing bays before exiting the lease perimeter to prevent off-site track-out.\"\n" +
                "}");
        settings.setSafetyGuidelinesJson("{\n" +
                "  \"overview\": \"SSE enforces a risk assessment, and operational control structure aimed at achieving an absolute zero-harm workplace.\",\n" +
                "  \"items\": [\n" +
                "    {\"title\": \"Continuous Airborne Monitoring\", \"text\": \"Regular, quantified air quality and crystalline silica exposure testing across all work zones to safeguard personnel respiratory health.\"},\n" +
                "    {\"title\": \"Proactive Hazard Elimination\", \"text\": \"Mechanized equipment interfaces and automated handling lines drastically reduce manual worker exposure to open extraction vectors.\"},\n" +
                "    {\"title\": \"HSE Training & Leadership\", \"text\": \"Mandatory, continuous safety competency training, operational risk profiling, and immediate incident reporting systems for all field teams and logistics contractors.\"}\n" +
                "  ]\n" +
                "}");
        settings.setSupplyTermsJson("{\n" +
                "  \"terms\": [\n" +
                "    {\"title\": \"Contractual Formation\", \"text\": \"All supply provisions, offtake allocations, and pricing metrics are governed strictly by executed written contracts. SSE expressly rejects any standard purchase terms or unilateral buyer mandates unless explicitly integrated via a signed Order Acceptance.\"},\n" +
                "    {\"title\": \"Title & Risk Allocation\", \"text\": \"Risk of loss passes to the purchaser immediately upon delivery to the agreed Free-on-Board (FOB), rail-head, or ex-mine destination. Legal title to all bulk minerals remains vested in SSE until full, unencumbered payment is received in our accounts.\"},\n" +
                "    {\"title\": \"Quality Inspection Protocols\", \"text\": \"Final chemical and physical grading configurations are established at the loading point by authorized independent surveyors. These findings constitute the definitive metrics for commercial invoicing.\"},\n" +
                "    {\"title\": \"Force Majeure Allocation\", \"text\": \"SSE shall not be held liable for supply gaps, transit stoppages, or production deficits arising from acts of God, labour disruptions, government intervention, or revisions to statutory mining laws.\"}\n" +
                "  ],\n" +
                "  \"legalDisclaimer\": \"The data hosted on this platform is for informational purposes only and is delivered on an \\\"as-is\\\" and \\\"as-available\\\" basis without any express or implied warranties. SSE does not guarantee the absolute real-time accuracy or market completeness of the geological estimates shown. No details contained herein constitute an institutional offer to sell, a prospectus, or financial advice regarding mineral forward pricing. Users leverage this domain's digital assets entirely at their own commercial risk.\"\n" +
                "}");
        settings.setAssetAllocationsJson("[\n" +
                "  {\"mineral\": \"Iron Ore: High-Grade Hematite Lumps\", \"status\": \"ALLOCATED / MULTI-YEAR CONTRACTS ONLY\", \"color\": \"blue\"},\n" +
                "  {\"mineral\": \"Iron Ore: Sized Hematite Fines\", \"status\": \"SPOT VOLUME AVAILABLE\", \"color\": \"green\"},\n" +
                "  {\"mineral\": \"Iron Ore: Ultra-Fine Blue Dust\", \"status\": \"SPOT VOLUME AVAILABLE\", \"color\": \"green\"},\n" +
                "  {\"mineral\": \"Manganese Ore (High/Medium Grade)\", \"status\": \"LIMITED CAPACITY\", \"color\": \"yellow\"},\n" +
                "  {\"mineral\": \"Laterite (Cement Corrective Grade)\", \"status\": \"HIGH AVAILABILITY\", \"color\": \"green\"},\n" +
                "  {\"mineral\": \"Ochre (Natural Red / Yellow)\", \"status\": \"SPOT VOLUME AVAILABLE\", \"color\": \"green\"}\n" +
                "]");
        settings.setRegisteredOfficeJson("{\n" +
                "  \"officeName\": \"S S Enterprises\",\n" +
                "  \"address\": \"40, APR Society, Katanga Colony, Jabalpur, Madhya Pradesh 482001\",\n" +
                "  \"miningOperations\": \"Village Gosalpur, Tehsil Sihora, District Jabalpur, Madhya Pradesh\",\n" +
                "  \"isoCertifications\": \"ISO 9001:2015 QUALITY MANAGEMENT SYSTEM | ISO 14001:2015 ENVIRONMENT MANAGEMENT SYSTEM | ISO 45001:2018 OCCUPATIONAL HEALTH & SAFETY MANAGEMENT SYSTEM\"\n" +
                "}");
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
        settings.setGstin(valueOrEmpty(request.gstin()));
        settings.setProprietor(valueOrEmpty(request.proprietor()));
        settings.setMineSiteAddress(request.mineSiteAddress());
        settings.setWhyChooseUsJson(request.whyChooseUsJson());
        settings.setCoreValuesJson(request.coreValuesJson());
        settings.setServicesJson(request.servicesJson());
        settings.setFutureGoalsJson(request.futureGoalsJson());
        settings.setStrengthText(request.strengthText());
        settings.setCommitmentText(request.commitmentText());
        settings.setProductsJson(request.productsJson());
        settings.setTechnicalSpecsJson(request.technicalSpecsJson());
        settings.setSafetyGuidelinesJson(request.safetyGuidelinesJson());
        settings.setSupplyTermsJson(request.supplyTermsJson());
        settings.setAssetAllocationsJson(request.assetAllocationsJson());
        settings.setRegisteredOfficeJson(request.registeredOfficeJson());
    }

    private String valueOrHash(String value) {
        return value == null || value.isBlank() ? "#" : value;
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
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
                settings.getWhyChooseUsJson(),
                settings.getCoreValuesJson(),
                settings.getServicesJson(),
                settings.getFutureGoalsJson(),
                settings.getStrengthText(),
                settings.getCommitmentText(),
                settings.getProductsJson(),
                settings.getTechnicalSpecsJson(),
                settings.getSafetyGuidelinesJson(),
                settings.getSupplyTermsJson(),
                settings.getAssetAllocationsJson(),
                settings.getRegisteredOfficeJson(),
                settings.getUpdatedAt());
    }
}
