package com.mins.settings;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "site_settings")
public class SiteSettings {

    @Id
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String tagline;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String logoUrl;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private String whatsappNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String location;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mapEmbedUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String websiteUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String facebookUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instagramUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String linkedinUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String xUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String copyrightText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aboutEyebrow;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aboutTitle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aboutContent;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aboutImageUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String directorMessage;

    @Column(nullable = false, length = 1000)
    private String updatedAt;

    protected SiteSettings() {
    }

    public SiteSettings(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getWhatsappNumber() {
        return whatsappNumber;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMapEmbedUrl() {
        return mapEmbedUrl;
    }

    public void setMapEmbedUrl(String mapEmbedUrl) {
        this.mapEmbedUrl = mapEmbedUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getXUrl() {
        return xUrl;
    }

    public void setXUrl(String xUrl) {
        this.xUrl = xUrl;
    }

    public String getCopyrightText() {
        return copyrightText;
    }

    public void setCopyrightText(String copyrightText) {
        this.copyrightText = copyrightText;
    }

    public String getAboutEyebrow() {
        return aboutEyebrow;
    }

    public void setAboutEyebrow(String aboutEyebrow) {
        this.aboutEyebrow = aboutEyebrow;
    }

    public String getAboutTitle() {
        return aboutTitle;
    }

    public void setAboutTitle(String aboutTitle) {
        this.aboutTitle = aboutTitle;
    }

    public String getAboutContent() {
        return aboutContent;
    }

    public void setAboutContent(String aboutContent) {
        this.aboutContent = aboutContent;
    }

    public String getAboutImageUrl() {
        return aboutImageUrl;
    }

    public void setAboutImageUrl(String aboutImageUrl) {
        this.aboutImageUrl = aboutImageUrl;
    }

    public String getDirectorMessage() {
        return directorMessage;
    }

    public void setDirectorMessage(String directorMessage) {
        this.directorMessage = directorMessage;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt.toString();
    }
}
