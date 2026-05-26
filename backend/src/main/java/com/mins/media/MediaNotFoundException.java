package com.mins.media;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MediaNotFoundException extends RuntimeException {

    public MediaNotFoundException(long id) {
        super("Media not found: " + id);
    }
}
