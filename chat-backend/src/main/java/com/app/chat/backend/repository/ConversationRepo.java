package com.app.chat.backend.repository;

import com.app.chat.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConversationRepo extends JpaRepository<Conversation , Long> {

    @Query("""
            SELECT c from Conversation c
            WHERE
            (c.sender.id = :senderId AND c.receiver.id = :receiverId)
            OR
            (c.sender.id = :receiverId AND c.receiver.id = :senderId)
            """)
    Conversation findConversationBetweenUsers(Long senderId, Long receiverId);

    @Query("""
            SELECT c FROM Conversation c
            WHERE
            (c.sender.id = :senderId AND c.group.id = :groupId)
            OR
            (c.group.id = :groupId)
            """)
    Conversation findConversationInGroup(Long senderId, Long groupId);
}
