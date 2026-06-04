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
                "ISO Compliance Integration",
                "Consultancy",
                "Integrated ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 management frameworks.",
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                "Independently assessed and certified by KK Cert for sustainable mining processes, zero-harm policies, and rigorous environmental stewardship.",
                Instant.now()
        ));
        projectRepository.save(new ProjectEntity(
                "Gosalpur Ambient Quality Monitoring",
                "Industrial Solutions",
                "Periodic monitoring of air parameters (PM10, PM2.5, SO2, NO2) and noise levels.",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                "Conducted by Sense Varun Environmental Lab, proving that all parameters are well within Central Pollution Control Board (CPCB) standards.",
                Instant.now()
        ));
        projectRepository.save(new ProjectEntity(
                "Hydrological & Water Safety Auditing",
                "Industrial Solutions",
                "Regular physical and chemical assessment of ground water and mines pit water.",
                "https://images.unsplash.com/photo-1576086213369-97a306d36557",
                "Verified safe water stewardship with chemical indexes fully compliant with IS 10500:2012 permissible limits.",
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
