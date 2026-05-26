package com.mins.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactQueryResponse submit(@Valid @RequestBody ContactRequest request) {
        return contactService.submit(request);
    }

    @GetMapping
    public List<ContactQueryResponse> findAll() {
        return contactService.findAll();
    }

    @PutMapping("/{id}/status")
    public ContactQueryResponse updateStatus(
            @PathVariable long id,
            @Valid @RequestBody ContactStatusRequest request
    ) {
        return contactService.updateStatus(id, request.status());
    }
}
