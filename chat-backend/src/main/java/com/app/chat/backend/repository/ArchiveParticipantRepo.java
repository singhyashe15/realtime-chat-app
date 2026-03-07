package com.app.chat.backend.repository;

import com.app.chat.backend.entity.ArchiveParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchiveParticipantRepo extends JpaRepository<ArchiveParticipant, Long> {
    List<ArchiveParticipant> findByUserId(Long archivedByUserId);
}
