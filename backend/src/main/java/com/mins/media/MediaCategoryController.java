package com.mins.media;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/media/categories")
public class MediaCategoryController {

    private final MediaCategoryService categoryService;

    public MediaCategoryController(MediaCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<MediaCategoryResponse> findAll() {
        return categoryService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaCategoryResponse create(@Valid @RequestBody MediaCategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/{id}")
    public MediaCategoryResponse update(
            @PathVariable long id,
            @Valid @RequestBody MediaCategoryRequest request
    ) {
        return categoryService.update(id, request);
    }
}
