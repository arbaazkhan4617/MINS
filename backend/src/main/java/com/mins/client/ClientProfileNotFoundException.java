package com.mins.client;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ClientProfileNotFoundException extends ResponseStatusException {
    public ClientProfileNotFoundException(long id) {
        super(HttpStatus.NOT_FOUND, "Client profile not found: " + id);
    }
}
