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

import java.time.Instant;

@Entity
@Table(name = "media_items")
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column
    private String subCategory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_category_id", foreignKey = @ForeignKey(name = "fk_media_items_sub_category"))
    private MediaSubCategory subCategoryEntity;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private Instant uploadedAt;

    protected MediaItem() {
    }

    public MediaItem(String title, MediaSubCategory subCategoryEntity, String type, String url, Instant uploadedAt) {
        this.title = title;
        setSubCategoryEntity(subCategoryEntity);
        this.type = type;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        if (subCategoryEntity != null) {
            return subCategoryEntity.getCategory();
        }
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategory() {
        if (subCategoryEntity != null) {
            return subCategoryEntity.getName();
        }
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    public MediaSubCategory getSubCategoryEntity() {
        return subCategoryEntity;
    }

    public void setSubCategoryEntity(MediaSubCategory subCategoryEntity) {
        this.subCategoryEntity = subCategoryEntity;
        if (subCategoryEntity != null) {
            this.category = subCategoryEntity.getCategory();
            this.subCategory = subCategoryEntity.getName();
        }
    }

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
