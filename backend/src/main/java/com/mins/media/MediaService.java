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
        mediaItems.add(new MediaItem("Dispatch Coordination", resolveSubCategory("Operations", "Dispatch Coordination"), "Image", "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=85", now));
        mediaItems.add(new MediaItem("Warehouse Review", resolveSubCategory("Work", "Warehouse Review"), "Video", "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=85", now.minusSeconds(60)));
        mediaItems.add(new MediaItem("Client Discussion", resolveSubCategory("Company", "Client Discussion"), "Image", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85", now.minusSeconds(120)));
        mediaItems.add(new MediaItem("Team Planning Desk", resolveSubCategory("Company", "Team Planning Desk"), "Image", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85", now.minusSeconds(180)));
        mediaItems.add(new MediaItem("Service Planning", resolveSubCategory("Events", "Service Planning"), "Video", "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85", now.minusSeconds(240)));
        mediaItems.add(new MediaItem("Supply Documentation", resolveSubCategory("Operations", "Supply Documentation"), "Image", "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=85", now.minusSeconds(300)));
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
