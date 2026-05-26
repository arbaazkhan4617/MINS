package com.mins.media;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "media_sub_categories",
        uniqueConstraints = @UniqueConstraint(columnNames = {"category_id", "name"})
)
public class MediaSubCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "fk_media_sub_categories_category"))
    private MediaCategory category;

    @Column(name = "category", nullable = false)
    private String legacyCategory;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean active;

    protected MediaSubCategory() {
    }

    public MediaSubCategory(MediaCategory category, String name, boolean active) {
        setCategory(category);
        this.name = name;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getCategory() {
        return category == null ? legacyCategory : category.getName();
    }

    public MediaCategory getCategoryEntity() {
        return category;
    }

    public void setCategory(MediaCategory category) {
        this.category = category;
        this.legacyCategory = category == null ? legacyCategory : category.getName();
    }

    public String getLegacyCategory() {
        return legacyCategory;
    }

    public void setLegacyCategory(String legacyCategory) {
        this.legacyCategory = legacyCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
