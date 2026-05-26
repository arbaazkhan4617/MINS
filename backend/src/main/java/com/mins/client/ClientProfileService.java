package com.mins.client;

import com.mins.common.UploadStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Service
public class ClientProfileService {

    private final ClientProfileRepository clientProfileRepository;
    private final UploadStorageService uploadStorageService;

    public ClientProfileService(
            ClientProfileRepository clientProfileRepository,
            UploadStorageService uploadStorageService
    ) {
        this.clientProfileRepository = clientProfileRepository;
        this.uploadStorageService = uploadStorageService;
    }

    @PostConstruct
    public void seedDefaultClients() {
        if (clientProfileRepository.count() > 0) {
            return;
        }

        Instant now = Instant.now();
        clientProfileRepository.save(new ClientProfile(
                "Rakesh Agarwal",
                "Procurement Manager",
                "Agarwal Industrial Supply",
                "They explain clearly, follow up properly, and keep commitments realistic.",
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
                1,
                now,
                now
        ));
        clientProfileRepository.save(new ClientProfile(
                "Meena Sharma",
                "Business Owner",
                "Sharma Trading Co.",
                "MINS feels dependable because the team is reachable even after the order is closed.",
                "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=240&q=85",
                2,
                now,
                now
        ));
        clientProfileRepository.save(new ClientProfile(
                "Arvind Patel",
                "Operations Lead",
                "Patel Logistics Services",
                "Their strength is simple communication and consistent service discipline.",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85",
                3,
                now,
                now
        ));
    }

    public List<ClientProfileResponse> findAll() {
        return clientProfileRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ClientProfileResponse create(ClientProfileRequest request) {
        Instant now = Instant.now();
        ClientProfile clientProfile = new ClientProfile(
                request.name(),
                request.role(),
                request.company(),
                request.quote(),
                request.photoUrl(),
                request.displayOrder(),
                now,
                now
        );
        return toResponse(clientProfileRepository.save(clientProfile));
    }

    public ClientProfileResponse update(long id, ClientProfileRequest request) {
        ClientProfile clientProfile = clientProfileRepository.findById(id)
                .orElseThrow(() -> new ClientProfileNotFoundException(id));
        clientProfile.setName(request.name());
        clientProfile.setRole(request.role());
        clientProfile.setCompany(request.company());
        clientProfile.setQuote(request.quote());
        clientProfile.setPhotoUrl(request.photoUrl());
        clientProfile.setDisplayOrder(request.displayOrder());
        clientProfile.setUpdatedAt(Instant.now());
        return toResponse(clientProfileRepository.save(clientProfile));
    }

    public void delete(long id) {
        ClientProfile clientProfile = clientProfileRepository.findById(id)
                .orElseThrow(() -> new ClientProfileNotFoundException(id));
        uploadStorageService.delete(clientProfile.getPhotoUrl());
        clientProfileRepository.delete(clientProfile);
    }

    public ClientPhotoResponse uploadPhoto(MultipartFile file) {
        return new ClientPhotoResponse(uploadStorageService.store(file));
    }

    private ClientProfileResponse toResponse(ClientProfile clientProfile) {
        return new ClientProfileResponse(
                clientProfile.getId(),
                clientProfile.getName(),
                clientProfile.getRole(),
                clientProfile.getCompany(),
                clientProfile.getQuote(),
                clientProfile.getPhotoUrl(),
                clientProfile.getDisplayOrder(),
                clientProfile.getCreatedAt(),
                clientProfile.getUpdatedAt()
        );
    }
}
