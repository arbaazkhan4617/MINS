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
        if (homepageContentRepository.existsById(CONTENT_ID)) {
            return;
        }

        homepageContentRepository.save(new HomepageContent(
                CONTENT_ID,
                "Building Trust Since 2007",
                "ISO 9001, 14001, and 45001 certified manganese, laterite, iron ore, and ochre mining operations at Gosalpur.",
                DEFAULT_HERO_MEDIA,
                "image",
                "Ready to discuss your next business requirement?",
                "2007",
                "39.44 HA",
                "3 ISOs",
                "100% CPCB",
                Instant.now()
        ));
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
                .orElseGet(() -> homepageContentRepository.save(new HomepageContent(
                        CONTENT_ID,
                        "Building Trust Since 2007",
                        "ISO 9001, 14001, and 45001 certified manganese, laterite, iron ore, and ochre mining operations at Gosalpur.",
                        DEFAULT_HERO_MEDIA,
                        "image",
                        "Ready to discuss your next business requirement?",
                        "2007",
                        "39.44 HA",
                        "3 ISOs",
                        "100% CPCB",
                        Instant.now()
                )));
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
                content.getUpdatedAt()
        );
    }
}
