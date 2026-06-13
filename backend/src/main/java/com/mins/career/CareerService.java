package com.mins.career;

import com.mins.common.UploadStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Service
public class CareerService {

    private final CareerApplicationRepository repository;
    private final UploadStorageService uploadStorageService;

    public CareerService(CareerApplicationRepository repository, UploadStorageService uploadStorageService) {
        this.repository = repository;
        this.uploadStorageService = uploadStorageService;
    }

    public CareerApplicationResponse submit(
            MultipartFile resume,
            String name,
            String email,
            String phone,
            String position,
            String message
    ) {
        String resumeUrl = uploadStorageService.store(resume);
        CareerApplication application = new CareerApplication(
                name,
                email,
                phone,
                position,
                message,
                resumeUrl,
                "New",
                Instant.now()
        );
        return toResponse(repository.save(application));
    }

    public List<CareerApplicationResponse> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CareerApplicationResponse updateStatus(long id, String status) {
        CareerApplication application = repository.findById(id)
                .orElseThrow(() -> new CareerApplicationNotFoundException(id));
        application.setStatus(status);
        return toResponse(repository.save(application));
    }

    private CareerApplicationResponse toResponse(CareerApplication application) {
        return new CareerApplicationResponse(
                application.getId(),
                application.getName(),
                application.getEmail(),
                application.getPhone(),
                application.getPosition(),
                application.getMessage(),
                application.getResumeUrl(),
                application.getStatus(),
                application.getCreatedAt()
        );
    }
}
