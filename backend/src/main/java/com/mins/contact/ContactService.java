package com.mins.contact;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ContactService {

    private final ContactQueryRepository contactQueryRepository;

    public ContactService(ContactQueryRepository contactQueryRepository) {
        this.contactQueryRepository = contactQueryRepository;
    }

    public ContactQueryResponse submit(ContactRequest request) {
        ContactQuery query = new ContactQuery(
                request.name(),
                request.email(),
                request.phone(),
                request.message(),
                "New",
                Instant.now()
        );
        return toResponse(contactQueryRepository.save(query));
    }

    public List<ContactQueryResponse> findAll() {
        return contactQueryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ContactQueryResponse updateStatus(long id, String status) {
        ContactQuery query = contactQueryRepository.findById(id)
                .orElseThrow(() -> new ContactQueryNotFoundException(id));
        query.setStatus(status);
        return toResponse(contactQueryRepository.save(query));
    }

    private ContactQueryResponse toResponse(ContactQuery query) {
        return new ContactQueryResponse(
                query.getId(),
                query.getName(),
                query.getEmail(),
                query.getPhone(),
                query.getMessage(),
                query.getStatus(),
                query.getCreatedAt()
        );
    }
}
