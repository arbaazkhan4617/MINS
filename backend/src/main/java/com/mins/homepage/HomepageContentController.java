package com.mins.homepage;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/homepage-content")
public class HomepageContentController {

    private final HomepageContentService homepageContentService;

    public HomepageContentController(HomepageContentService homepageContentService) {
        this.homepageContentService = homepageContentService;
    }

    @GetMapping
    public HomepageContentResponse find() {
        return homepageContentService.find();
    }

    @PutMapping
    public HomepageContentResponse update(@Valid @RequestBody HomepageContentRequest request) {
        return homepageContentService.update(request);
    }

    @PostMapping("/media")
    @ResponseStatus(HttpStatus.CREATED)
    public HomepageMediaResponse uploadHeroMedia(@RequestPart("file") MultipartFile file) {
        return homepageContentService.uploadHeroMedia(file);
    }
}
