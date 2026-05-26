package com.mins.media;

import com.mins.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping
    public List<MediaResponse> findAll() {
        return mediaService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam @NotBlank String title,
            @RequestParam @NotBlank String category,
            @RequestParam @NotBlank String subCategory
    ) {
        return mediaService.upload(file, title, category, subCategory);
    }

    @PostMapping("/url")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse createFromUrl(@Valid @RequestBody MediaCreateRequest request) {
        return mediaService.create(request);
    }

    @PutMapping("/{id}")
    public MediaResponse update(
            @PathVariable long id,
            @Valid @RequestBody MediaUpdateRequest request
    ) {
        return mediaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable long id) {
        mediaService.delete(id);
        return new ApiResponse("Media deleted successfully");
    }
}
