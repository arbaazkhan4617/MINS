package com.mins.media;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MediaCategoryRepository extends JpaRepository<MediaCategory, Long> {
    List<MediaCategory> findAllByOrderByNameAsc();

    Optional<MediaCategory> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
