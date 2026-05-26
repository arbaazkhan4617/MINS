package com.mins.project;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @PostConstruct
    public void seedDefaults() {
        if (projectRepository.count() > 0) {
            return;
        }

        projectRepository.save(new ProjectEntity(
                "Industrial Supply Partnership",
                "Product Supply",
                "Coordinated recurring supply support for a regional industrial client.",
                "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
                "Placeholder project detail for admin-managed portfolio content.",
                Instant.now()
        ));
        projectRepository.save(new ProjectEntity(
                "Trading Network Expansion",
                "Trading",
                "Built stronger vendor coordination and procurement visibility.",
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                "Placeholder project detail for admin-managed portfolio content.",
                Instant.now()
        ));
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse create(ProjectRequest request) {
        return toResponse(projectRepository.save(toEntity(request, Instant.now())));
    }

    public ProjectResponse update(long id, ProjectRequest request) {
        ProjectEntity project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
        project.setTitle(request.title());
        project.setCategory(request.category());
        project.setSummary(request.summary());
        project.setImageUrl(request.imageUrl());
        project.setDescription(request.description());
        return toResponse(projectRepository.save(project));
    }

    public void delete(long id) {
        if (!projectRepository.existsById(id)) {
            throw new ProjectNotFoundException(id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectEntity toEntity(ProjectRequest request, Instant createdAt) {
        return new ProjectEntity(
                request.title(),
                request.category(),
                request.summary(),
                request.imageUrl(),
                request.description(),
                createdAt
        );
    }

    private ProjectResponse toResponse(ProjectEntity project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getCategory(),
                project.getSummary(),
                project.getImageUrl(),
                project.getDescription(),
                project.getCreatedAt()
        );
    }
}
