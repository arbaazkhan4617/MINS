package com.mins.auth;

import com.mins.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AdminUserService adminUserService;

    public AuthController(
            JwtService jwtService,
            AdminUserService adminUserService
    ) {
        this.jwtService = jwtService;
        this.adminUserService = adminUserService;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        AdminUser adminUser = adminUserService.authenticate(request.email(), request.password());

        return new AuthResponse(
                jwtService.createToken(adminUser.getEmail()),
                "Bearer",
                jwtService.expirationMinutes()
        );
    }

    @PutMapping("/password")
    public ApiResponse updatePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordUpdateRequest request
    ) {
        adminUserService.updatePassword(authentication.getName(), request);
        return new ApiResponse("Password updated successfully");
    }
}
