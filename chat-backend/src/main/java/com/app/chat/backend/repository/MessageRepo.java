package com.app.chat.backend.repository;


import com.app.chat.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message , Long> {
    List<Message> findByConversationId(Long id);
    @Query("""
            SELECT msg FROM Message msg
            WHERE msg.conversation.id = :id
            ORDER BY(msg.createdAt) DESC
            LIMIT 1
            """)
    Message findLastConversation(Long id);

//    void deleteAllByConversationId(Long id);

    List<Message> findAllByConversationId(Long id);
}
