package com.mins.client;

import com.mins.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientProfileController {

    private final ClientProfileService clientProfileService;

    public ClientProfileController(ClientProfileService clientProfileService) {
        this.clientProfileService = clientProfileService;
    }

    @GetMapping
    public List<ClientProfileResponse> findAll() {
        return clientProfileService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientProfileResponse create(@Valid @RequestBody ClientProfileRequest request) {
        return clientProfileService.create(request);
    }

    @PutMapping("/{id}")
    public ClientProfileResponse update(
            @PathVariable long id,
            @Valid @RequestBody ClientProfileRequest request
    ) {
        return clientProfileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable long id) {
        clientProfileService.delete(id);
        return new ApiResponse("Client profile deleted successfully");
    }

    @PostMapping("/photos")
    @ResponseStatus(HttpStatus.CREATED)
    public ClientPhotoResponse uploadPhoto(@RequestPart("file") MultipartFile file) {
        return clientProfileService.uploadPhoto(file);
    }
}
