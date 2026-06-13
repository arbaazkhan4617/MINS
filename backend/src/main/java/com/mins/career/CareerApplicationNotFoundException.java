package com.mins.career;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CareerApplicationNotFoundException extends RuntimeException {
    public CareerApplicationNotFoundException(long id) {
        super("Career application not found: " + id);
    }
}
