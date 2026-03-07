package com.app.chat.backend.repository;

import com.app.chat.backend.entity.FavouriteParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavParticipantRepo extends JpaRepository<FavouriteParticipant, Long> {
}
