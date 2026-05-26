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
@RequestMapping("/api/media/subcategories")
public class MediaSubCategoryController {

    private final MediaSubCategoryService subCategoryService;

    public MediaSubCategoryController(MediaSubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    @GetMapping
    public List<MediaSubCategoryResponse> findAll() {
        return subCategoryService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaSubCategoryResponse create(@Valid @RequestBody MediaSubCategoryRequest request) {
        return subCategoryService.create(request);
    }

    @PutMapping("/{id}")
    public MediaSubCategoryResponse update(
            @PathVariable long id,
            @Valid @RequestBody MediaSubCategoryRequest request
    ) {
        return subCategoryService.update(id, request);
    }
}
