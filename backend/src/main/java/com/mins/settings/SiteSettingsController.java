package com.mins.settings;

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
@RequestMapping("/api/site-settings")
public class SiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    public SiteSettingsController(SiteSettingsService siteSettingsService) {
        this.siteSettingsService = siteSettingsService;
    }

    @GetMapping
    public SiteSettingsResponse find() {
        return siteSettingsService.find();
    }

    @PutMapping
    public SiteSettingsResponse update(@Valid @RequestBody SiteSettingsRequest request) {
        return siteSettingsService.update(request);
    }

    @PostMapping("/uploads")
    @ResponseStatus(HttpStatus.CREATED)
    public SiteUploadResponse upload(@RequestPart("file") MultipartFile file) {
        return siteSettingsService.upload(file);
    }
}
