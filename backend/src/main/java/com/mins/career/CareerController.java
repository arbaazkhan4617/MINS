package com.mins.career;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/careers")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerApplicationResponse submit(
            @RequestPart("resume") MultipartFile resume,
            @RequestParam @NotBlank String name,
            @RequestParam @NotBlank String email,
            @RequestParam @NotBlank String phone,
            @RequestParam @NotBlank String position,
            @RequestParam @NotBlank String message
    ) {
        return careerService.submit(resume, name, email, phone, position, message);
    }

    @GetMapping
    public List<CareerApplicationResponse> findAll() {
        return careerService.findAll();
    }

    @PutMapping("/{id}/status")
    public CareerApplicationResponse updateStatus(
            @PathVariable long id,
            @Valid @RequestBody CareerStatusRequest request
    ) {
        return careerService.updateStatus(id, request.status());
    }
}
