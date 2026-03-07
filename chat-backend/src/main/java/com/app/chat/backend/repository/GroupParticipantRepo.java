package com.app.chat.backend.repository;

import com.app.chat.backend.entity.GroupParticipant;
import com.app.chat.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupParticipantRepo extends JpaRepository<GroupParticipant,Long> {
    List<GroupParticipant> findByGroupMembers(User user);

    GroupParticipant findByIdAndGroupMembersId(Long groupId, Long userId);
}
