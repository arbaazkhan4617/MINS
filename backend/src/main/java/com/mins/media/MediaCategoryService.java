package com.mins.media;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class MediaCategoryService {

    private static final List<String> DEFAULT_CATEGORIES = List.of("Operations", "Work", "Company", "Events");

    private final MediaCategoryRepository categoryRepository;
    private final MediaRepository mediaRepository;
    private final MediaSubCategoryRepository subCategoryRepository;

    public MediaCategoryService(
            MediaCategoryRepository categoryRepository,
            MediaRepository mediaRepository,
            MediaSubCategoryRepository subCategoryRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.mediaRepository = mediaRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    @PostConstruct
    public void seedCategories() {
        Set<String> categories = new LinkedHashSet<>(DEFAULT_CATEGORIES);
        categories.addAll(mediaRepository.findDistinctCategories());

        for (String category : categories) {
            String normalized = normalizeName(category);
            if (!normalized.isBlank() && !categoryRepository.existsByNameIgnoreCase(normalized)) {
                categoryRepository.save(new MediaCategory(normalized, true));
            }
        }
    }

    public List<MediaCategoryResponse> findAll() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MediaCategoryResponse create(MediaCategoryRequest request) {
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }

        return toResponse(categoryRepository.save(new MediaCategory(name, request.active())));
    }

    @Transactional
    public MediaCategoryResponse update(long id, MediaCategoryRequest request) {
        MediaCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        String previousName = category.getName();
        String nextName = normalizeName(request.name());

        categoryRepository.findByNameIgnoreCase(nextName)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
                });

        category.setName(nextName);
        category.setActive(request.active());
        if (!previousName.equalsIgnoreCase(nextName)) {
            mediaRepository.renameCategory(previousName, nextName);
            subCategoryRepository.renameCategory(previousName, nextName);
        }

        return toResponse(categoryRepository.save(category));
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim().replaceAll("\\s+", " ");
    }

    private MediaCategoryResponse toResponse(MediaCategory category) {
        return new MediaCategoryResponse(category.getId(), category.getName(), category.isActive());
    }
}
