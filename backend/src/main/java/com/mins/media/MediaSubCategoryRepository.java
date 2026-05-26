package com.mins.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MediaSubCategoryRepository extends JpaRepository<MediaSubCategory, Long> {
    @Query("select subCategory from MediaSubCategory subCategory left join subCategory.category category order by category.name asc, subCategory.name asc")
    List<MediaSubCategory> findAllByOrderByCategoryAscNameAsc();

    @Query("""
            select subCategory
            from MediaSubCategory subCategory
            left join subCategory.category category
            where lower(coalesce(category.name, subCategory.legacyCategory)) = lower(:category)
              and lower(subCategory.name) = lower(:name)
            """)
    Optional<MediaSubCategory> findByCategoryIgnoreCaseAndNameIgnoreCase(
            @Param("category") String category,
            @Param("name") String name
    );

    @Modifying
    @Query("update MediaSubCategory subCategory set subCategory.legacyCategory = :nextCategory where lower(subCategory.legacyCategory) = lower(:previousCategory)")
    void renameCategory(@Param("previousCategory") String previousCategory, @Param("nextCategory") String nextCategory);
}
