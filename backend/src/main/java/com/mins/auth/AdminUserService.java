package com.mins.auth;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final String seedEmail;
    private final String seedPasswordHash;

    public AdminUserService(
            AdminUserRepository adminUserRepository,
            @Value("${app.admin.email}") String seedEmail,
            @Value("${app.admin.password-hash}") String seedPasswordHash
    ) {
        this.adminUserRepository = adminUserRepository;
        this.seedEmail = seedEmail;
        this.seedPasswordHash = seedPasswordHash;
    }

    @PostConstruct
    public void seedDefaultAdmin() {
        if (!adminUserRepository.existsByEmailIgnoreCase(seedEmail)) {
            adminUserRepository.save(new AdminUser(seedEmail, seedPasswordHash));
        }
    }

    public AdminUser authenticate(String email, String password) {
        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(email)
                .filter(AdminUser::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(password, adminUser.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return adminUser;
    }

    public void updatePassword(String email, PasswordUpdateRequest request) {
        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(email)
                .filter(AdminUser::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin user not found"));

        if (!passwordEncoder.matches(request.currentPassword(), adminUser.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        adminUser.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        adminUserRepository.save(adminUser);
    }
}
