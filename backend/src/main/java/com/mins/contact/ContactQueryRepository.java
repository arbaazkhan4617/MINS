package com.mins.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {
    List<ContactQuery> findAllByOrderByCreatedAtDesc();
}
