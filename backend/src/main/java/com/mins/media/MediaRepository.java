package com.mins.media;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MediaRepository extends JpaRepository<MediaItem, Long> {
    List<MediaItem> findAllByOrderByUploadedAtDesc();

    @Query("""
            select distinct coalesce(category.name, item.category)
            from MediaItem item
            left join item.subCategoryEntity subCategory
            left join subCategory.category category
            """)
    List<String> findDistinctCategories();

    @Query("""
            select distinct coalesce(subCategory.name, item.subCategory)
            from MediaItem item
            left join item.subCategoryEntity subCategory
            where coalesce(subCategory.name, item.subCategory) is not null
            """)
    List<String> findDistinctSubCategories();

    @Modifying
    @Query("update MediaItem item set item.category = :nextCategory where lower(item.category) = lower(:previousCategory)")
    void renameCategory(@Param("previousCategory") String previousCategory, @Param("nextCategory") String nextCategory);

    @Modifying
    @Query("""
            update MediaItem item
            set item.category = :nextCategory, item.subCategory = :nextSubCategory
            where lower(item.category) = lower(:previousCategory)
              and lower(item.subCategory) = lower(:previousSubCategory)
            """)
    void renameSubCategory(
            @Param("previousCategory") String previousCategory,
            @Param("previousSubCategory") String previousSubCategory,
            @Param("nextCategory") String nextCategory,
            @Param("nextSubCategory") String nextSubCategory
    );
}
