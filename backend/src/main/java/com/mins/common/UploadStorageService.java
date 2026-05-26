package com.mins.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadStorageService {

    private final Path uploadDirectory;

    public UploadStorageService(@Value("${app.uploads.directory}") String uploadDirectory) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
        createUploadDirectory();
    }

    public String store(MultipartFile file) {
        String originalName = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
        String sanitizedName = Path.of(originalName).getFileName().toString().replaceAll("[^a-zA-Z0-9._-]", "-");
        String storedFilename = UUID.randomUUID() + "-" + sanitizedName;
        Path destination = uploadDirectory.resolve(storedFilename).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid upload filename");
        }

        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + storedFilename;
        } catch (IOException exception) {
            throw new UncheckedIOException("Unable to store uploaded file", exception);
        }
    }

    public void delete(String url) {
        if (!url.startsWith("/uploads/")) {
            return;
        }

        Path file = uploadDirectory.resolve(url.substring("/uploads/".length())).normalize();
        if (!file.startsWith(uploadDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
            // The database record can still be deleted even if a stale file remains.
        }
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException exception) {
            throw new UncheckedIOException("Unable to create upload directory", exception);
        }
    }
}
