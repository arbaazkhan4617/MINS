package com.mins.media;

import com.mins.common.UploadStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaCategoryRepository categoryRepository;
    private final MediaSubCategoryRepository subCategoryRepository;
    private final UploadStorageService uploadStorageService;

    public MediaService(
            MediaRepository mediaRepository,
            MediaCategoryRepository categoryRepository,
            MediaSubCategoryRepository subCategoryRepository,
            UploadStorageService uploadStorageService
    ) {
        this.mediaRepository = mediaRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.uploadStorageService = uploadStorageService;
    }

    @PostConstruct
    public void seedDefaultMedia() {
        if (mediaRepository.count() > 0) {
            backfillMissingSubCategories();
            return;
        }

        List<MediaItem> mediaItems = new ArrayList<>();
        Instant now = Instant.now();
        mediaItems.add(new MediaItem("Yoga Day Sessions at Gosalpur Mines", resolveSubCategory("International Yoga Day Boot Camp", "International Yoga Day Boot Camp"), "Image", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85", now));
        mediaItems.add(new MediaItem("Swachhata Hi Seva 2025 Cleanliness Drive", resolveSubCategory("Swachhata Hi Seva Campaign", "Swachhata Hi Seva Campaign"), "Image", "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=900&q=85", now.minusSeconds(60)));
        mediaItems.add(new MediaItem("Har Ghar Tiranga Flag Distribution", resolveSubCategory("Har Ghar Tiranga Campaign", "Har Ghar Tiranga Campaign"), "Image", "https://images.unsplash.com/photo-1596306499317-8490232098fa?auto=format&fit=crop&w=900&q=85", now.minusSeconds(120)));
        mediaItems.add(new MediaItem("Air Quality Monitoring Station", resolveSubCategory("Operations", "Operations"), "Image", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85", now.minusSeconds(180)));
        mediaItems.add(new MediaItem("Water Sample Collection & Testing", resolveSubCategory("Operations", "Operations"), "Image", "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=85", now.minusSeconds(240)));
        mediaItems.add(new MediaItem("ISO 9001 Process Auditing", resolveSubCategory("Operations", "Operations"), "Image", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=85", now.minusSeconds(300)));
        mediaRepository.saveAll(mediaItems);
    }

    public List<MediaResponse> findAll() {
        return mediaRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MediaResponse upload(MultipartFile file, String title, String category, String subCategory) {
        String type = file.getContentType() != null && file.getContentType().startsWith("video")
                ? "Video"
                : "Image";

        MediaItem mediaItem = new MediaItem(
                title,
                resolveSubCategory(category, subCategory),
                type,
                uploadStorageService.store(file),
                Instant.now()
        );
        return toResponse(mediaRepository.save(mediaItem));
    }

    public MediaResponse create(MediaCreateRequest request) {
        MediaItem mediaItem = new MediaItem(
                request.title(),
                resolveSubCategory(request.category(), request.subCategory()),
                normalizeType(request.type()),
                request.url(),
                Instant.now()
        );
        return toResponse(mediaRepository.save(mediaItem));
    }

    public MediaResponse update(long id, MediaUpdateRequest request) {
        MediaItem mediaItem = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        mediaItem.setTitle(request.title());
        mediaItem.setSubCategoryEntity(resolveSubCategory(request.category(), request.subCategory()));
        return toResponse(mediaRepository.save(mediaItem));
    }

    public void delete(long id) {
        MediaItem mediaItem = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        uploadStorageService.delete(mediaItem.getUrl());
        mediaRepository.delete(mediaItem);
    }

    private MediaResponse toResponse(MediaItem mediaItem) {
        return new MediaResponse(
                mediaItem.getId(),
                mediaItem.getTitle(),
                mediaItem.getCategory(),
                mediaItem.getSubCategory() == null || mediaItem.getSubCategory().isBlank()
                        ? mediaItem.getTitle()
                        : mediaItem.getSubCategory(),
                mediaItem.getType(),
                mediaItem.getUrl(),
                mediaItem.getUploadedAt()
        );
    }

    private void backfillMissingSubCategories() {
        List<MediaItem> mediaItems = mediaRepository.findAll();
        boolean changed = false;
        for (MediaItem mediaItem : mediaItems) {
            if (mediaItem.getSubCategory() == null || mediaItem.getSubCategory().isBlank()) {
                mediaItem.setSubCategory(mediaItem.getTitle());
                changed = true;
            }
            if (mediaItem.getSubCategoryEntity() == null) {
                mediaItem.setSubCategoryEntity(resolveSubCategory(mediaItem.getCategory(), mediaItem.getSubCategory()));
                changed = true;
            }
        }
        if (changed) {
            mediaRepository.saveAll(mediaItems);
        }
    }

    private MediaSubCategory resolveSubCategory(String category, String subCategory) {
        String normalizedCategory = normalizeName(category);
        String normalizedSubCategory = normalizeName(subCategory);
        MediaCategory categoryEntity = categoryRepository.findByNameIgnoreCase(normalizedCategory)
                .orElseGet(() -> categoryRepository.save(new MediaCategory(normalizedCategory, true)));

        return subCategoryRepository.findByCategoryIgnoreCaseAndNameIgnoreCase(normalizedCategory, normalizedSubCategory)
                .orElseGet(() -> subCategoryRepository.save(new MediaSubCategory(categoryEntity, normalizedSubCategory, true)));
    }

    private String normalizeName(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeType(String type) {
        return "video".equalsIgnoreCase(type) ? "Video" : "Image";
    }
}
