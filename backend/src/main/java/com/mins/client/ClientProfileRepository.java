package com.mins.client;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    List<ClientProfile> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
