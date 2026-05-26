package com.mins.homepage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "homepage_content")
public class HomepageContent {

    @Id
    private Long id;

    @Column(nullable = false, length = 1000)
    private String heroHeadline;

    @Column(nullable = false, length = 2000)
    private String heroSubheading;

    @Column(nullable = false, length = 4000)
    private String heroMediaSrc;

    @Column(nullable = false)
    private String heroMediaType;

    @Column(nullable = false, length = 1000)
    private String ctaTitle;

    @Column(nullable = false)
    private String stat1;

    @Column(nullable = false)
    private String stat2;

    @Column(nullable = false)
    private String stat3;

    @Column(nullable = false)
    private String stat4;

    @Column(nullable = false)
    private Instant updatedAt;

    protected HomepageContent() {
    }

    public HomepageContent(
            Long id,
            String heroHeadline,
            String heroSubheading,
            String heroMediaSrc,
            String heroMediaType,
            String ctaTitle,
            String stat1,
            String stat2,
            String stat3,
            String stat4,
            Instant updatedAt
    ) {
        this.id = id;
        this.heroHeadline = heroHeadline;
        this.heroSubheading = heroSubheading;
        this.heroMediaSrc = heroMediaSrc;
        this.heroMediaType = heroMediaType;
        this.ctaTitle = ctaTitle;
        this.stat1 = stat1;
        this.stat2 = stat2;
        this.stat3 = stat3;
        this.stat4 = stat4;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getHeroHeadline() {
        return heroHeadline;
    }

    public void setHeroHeadline(String heroHeadline) {
        this.heroHeadline = heroHeadline;
    }

    public String getHeroSubheading() {
        return heroSubheading;
    }

    public void setHeroSubheading(String heroSubheading) {
        this.heroSubheading = heroSubheading;
    }

    public String getHeroMediaSrc() {
        return heroMediaSrc;
    }

    public void setHeroMediaSrc(String heroMediaSrc) {
        this.heroMediaSrc = heroMediaSrc;
    }

    public String getHeroMediaType() {
        return heroMediaType;
    }

    public void setHeroMediaType(String heroMediaType) {
        this.heroMediaType = heroMediaType;
    }

    public String getCtaTitle() {
        return ctaTitle;
    }

    public void setCtaTitle(String ctaTitle) {
        this.ctaTitle = ctaTitle;
    }

    public String getStat1() {
        return stat1;
    }

    public void setStat1(String stat1) {
        this.stat1 = stat1;
    }

    public String getStat2() {
        return stat2;
    }

    public void setStat2(String stat2) {
        this.stat2 = stat2;
    }

    public String getStat3() {
        return stat3;
    }

    public void setStat3(String stat3) {
        this.stat3 = stat3;
    }

    public String getStat4() {
        return stat4;
    }

    public void setStat4(String stat4) {
        this.stat4 = stat4;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
