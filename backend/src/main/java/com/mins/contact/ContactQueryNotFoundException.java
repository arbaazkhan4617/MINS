package com.mins.contact;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ContactQueryNotFoundException extends RuntimeException {

    public ContactQueryNotFoundException(long id) {
        super("Contact query not found: " + id);
    }
}
