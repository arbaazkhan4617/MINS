package com.mins.homepage;

import com.mins.common.UploadStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Service
public class HomepageContentService {

    private static final long CONTENT_ID = 1L;
    private static final String DEFAULT_HERO_MEDIA =
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85";

    private final HomepageContentRepository homepageContentRepository;
    private final UploadStorageService uploadStorageService;

    public HomepageContentService(
            HomepageContentRepository homepageContentRepository,
            UploadStorageService uploadStorageService
    ) {
        this.homepageContentRepository = homepageContentRepository;
        this.uploadStorageService = uploadStorageService;
    }

    @PostConstruct
    public void seedDefaultContent() {
        if (!homepageContentRepository.existsById(CONTENT_ID)) {
            HomepageContent content = new HomepageContent(
                    CONTENT_ID,
                    "Securing Mineral Continuity. Engineering Global Compliance.",
                    "Established in 2007, SSE is a premier resource extraction corporation specializing in the ISO 14001:2015, ISO 45001:2018, and ISO 9001:2015 compliant mining, processing, and industrial supply of high-grade Hematite, Manganese Ore, Laterite, and Ochre.",
                    DEFAULT_HERO_MEDIA,
                    "image",
                    "Ready to discuss your next business requirement?",
                    "2007",
                    "39.44 HA",
                    "3 ISOs",
                    "100% CPCB",
                    Instant.now()
            );
            content.setHeroSlidesJson(defaultHeroSlidesJson());
            homepageContentRepository.save(content);
        } else {
            HomepageContent content = homepageContentRepository.findById(CONTENT_ID).orElseThrow();
            if (content.getHeroSlidesJson() == null || content.getHeroSlidesJson().isBlank()) {
                content.setHeroSlidesJson(defaultHeroSlidesJson());
                homepageContentRepository.save(content);
            }
        }
    }

    public HomepageContentResponse find() {
        return toResponse(getContent());
    }

    public HomepageContentResponse update(HomepageContentRequest request) {
        HomepageContent content = getContent();
        content.setHeroHeadline(request.heroHeadline());
        content.setHeroSubheading(request.heroSubheading());
        content.setHeroMediaSrc(request.heroMediaSrc());
        content.setHeroMediaType(normalizeMediaType(request.heroMediaType()));
        content.setCtaTitle(request.ctaTitle());
        content.setStat1(request.stats().get(0));
        content.setStat2(request.stats().get(1));
        content.setStat3(request.stats().get(2));
        content.setStat4(request.stats().get(3));
        content.setHeroSlidesJson(request.heroSlidesJson());
        content.setUpdatedAt(Instant.now());
        return toResponse(homepageContentRepository.save(content));
    }

    public HomepageMediaResponse uploadHeroMedia(MultipartFile file) {
        String type = file.getContentType() != null && file.getContentType().startsWith("video")
                ? "video"
                : "image";
        return new HomepageMediaResponse(uploadStorageService.store(file), type);
    }

    private HomepageContent getContent() {
        return homepageContentRepository.findById(CONTENT_ID)
                .orElseGet(() -> {
                    HomepageContent c = new HomepageContent(
                            CONTENT_ID,
                            "Securing Mineral Continuity. Engineering Global Compliance.",
                            "Established in 2007, SSE is a premier resource extraction corporation specializing in the ISO 14001:2015, ISO 45001:2018, and ISO 9001:2015 compliant mining, processing, and industrial supply of high-grade Hematite, Manganese Ore, Laterite, and Ochre.",
                            DEFAULT_HERO_MEDIA,
                            "image",
                            "Ready to discuss your next business requirement?",
                            "2007",
                            "39.44 HA",
                            "3 ISOs",
                            "100% CPCB",
                            Instant.now()
                    );
                    c.setHeroSlidesJson(defaultHeroSlidesJson());
                    return homepageContentRepository.save(c);
                });
    }

    private String normalizeMediaType(String mediaType) {
        return "video".equalsIgnoreCase(mediaType) ? "video" : "image";
    }

    private HomepageContentResponse toResponse(HomepageContent content) {
        return new HomepageContentResponse(
                content.getHeroHeadline(),
                content.getHeroSubheading(),
                content.getHeroMediaSrc(),
                normalizeMediaType(content.getHeroMediaType()),
                content.getCtaTitle(),
                List.of(content.getStat1(), content.getStat2(), content.getStat3(), content.getStat4()),
                content.getHeroSlidesJson(),
                content.getUpdatedAt()
        );
    }

    private String defaultHeroSlidesJson() {
        return "[\n" +
                "  {\n" +
                "    \"mediaSrc\": \"" + DEFAULT_HERO_MEDIA + "\",\n" +
                "    \"mediaType\": \"image\",\n" +
                "    \"headline\": \"Securing Mineral Continuity. Engineering Global Compliance.\",\n" +
                "    \"subheading\": \"Established in 2007, SSE is a premier resource extraction corporation specializing in the ISO 14001:2015 | ENVIRONMENT MANAGEMENT SYSTEM, ISO 45001:2018 OCCUPATIONAL HEALTH & SAFETY MANAGEMENT SYSTEM, ISO 9001:2015 QUALITY MANAGEMENT SYSTEM compliant mining, processing, and industrial supply of high-grade Hematite (including premium Blue Dust), Manganese Ore, Laterite, and Ochre.\",\n" +
                "    \"badge\": \"SECURE SUPPLY. GLOBAL COMPLIANCE.\",\n" +
                "    \"exploreBtnText\": \"Mineral Portfolio\",\n" +
                "    \"exploreBtnLink\": \"/products\",\n" +
                "    \"contactBtnText\": \"Global Procurement\",\n" +
                "    \"contactBtnLink\": \"/procurement\"\n" +
                "  }\n" +
                "]";
    }
}
