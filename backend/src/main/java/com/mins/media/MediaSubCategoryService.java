package com.mins.media;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MediaSubCategoryService {

    private record DefaultSubCategory(String category, String name) {
    }

    private static final List<DefaultSubCategory> DEFAULT_SUB_CATEGORIES = List.of(
            new DefaultSubCategory("Operations", "Operations"),
            new DefaultSubCategory("Swachhata Hi Seva Campaign", "Swachhata Hi Seva Campaign"),
            new DefaultSubCategory("International Yoga Day Boot Camp", "International Yoga Day Boot Camp"),
            new DefaultSubCategory("Har Ghar Tiranga Campaign", "Har Ghar Tiranga Campaign")
    );

    private final MediaSubCategoryRepository subCategoryRepository;
    private final MediaCategoryRepository categoryRepository;
    private final MediaRepository mediaRepository;

    public MediaSubCategoryService(
            MediaSubCategoryRepository subCategoryRepository,
            MediaCategoryRepository categoryRepository,
            MediaRepository mediaRepository
    ) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.mediaRepository = mediaRepository;
    }

    @PostConstruct
    public void seedSubCategories() {
        for (DefaultSubCategory subCategory : DEFAULT_SUB_CATEGORIES) {
            createIfMissing(subCategory.category(), subCategory.name());
        }

        for (MediaItem mediaItem : mediaRepository.findAll()) {
            String subCategory = mediaItem.getSubCategory();
            if (subCategory == null || subCategory.isBlank()) {
                subCategory = mediaItem.getTitle();
            }
            createIfMissing(mediaItem.getCategory(), subCategory);
        }
    }

    public List<MediaSubCategoryResponse> findAll() {
        return subCategoryRepository.findAllByOrderByCategoryAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MediaSubCategoryResponse create(MediaSubCategoryRequest request) {
        String category = normalize(request.category());
        String name = normalize(request.name());
        subCategoryRepository.findByCategoryIgnoreCaseAndNameIgnoreCase(category, name)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Subcategory already exists");
                });

        MediaCategory categoryEntity = findOrCreateCategory(category);
        return toResponse(subCategoryRepository.save(new MediaSubCategory(categoryEntity, name, request.active())));
    }

    @Transactional
    public MediaSubCategoryResponse update(long id, MediaSubCategoryRequest request) {
        MediaSubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory not found"));
        String previousCategory = subCategory.getCategory();
        String previousName = subCategory.getName();
        MediaCategory nextCategory = findOrCreateCategory(request.category());
        String nextCategoryName = nextCategory.getName();
        String nextName = normalize(request.name());

        subCategoryRepository.findByCategoryIgnoreCaseAndNameIgnoreCase(nextCategoryName, nextName)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Subcategory already exists");
                });

        subCategory.setCategory(nextCategory);
        subCategory.setName(nextName);
        subCategory.setActive(request.active());
        if (!previousCategory.equalsIgnoreCase(nextCategoryName) || !previousName.equalsIgnoreCase(nextName)) {
            mediaRepository.renameSubCategory(previousCategory, previousName, nextCategoryName, nextName);
        }

        return toResponse(subCategoryRepository.save(subCategory));
    }

    private void createIfMissing(String category, String name) {
        String normalizedCategory = normalize(category);
        String normalizedName = normalize(name);
        if (normalizedCategory.isBlank() || normalizedName.isBlank()) {
            return;
        }

        MediaCategory categoryEntity = findOrCreateCategory(normalizedCategory);
        MediaSubCategory subCategory = subCategoryRepository
                .findByCategoryIgnoreCaseAndNameIgnoreCase(normalizedCategory, normalizedName)
                .orElseGet(() -> new MediaSubCategory(categoryEntity, normalizedName, true));

        if (subCategory.getCategoryEntity() == null) {
            subCategory.setCategory(categoryEntity);
        }
        subCategoryRepository.save(subCategory);
    }

    private MediaCategory findOrCreateCategory(String category) {
        String normalizedCategory = normalize(category);
        return categoryRepository.findByNameIgnoreCase(normalizedCategory)
                .orElseGet(() -> categoryRepository.save(new MediaCategory(normalizedCategory, true)));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private MediaSubCategoryResponse toResponse(MediaSubCategory subCategory) {
        return new MediaSubCategoryResponse(
                subCategory.getId(),
                subCategory.getCategory(),
                subCategory.getName(),
                subCategory.isActive()
        );
    }
}
