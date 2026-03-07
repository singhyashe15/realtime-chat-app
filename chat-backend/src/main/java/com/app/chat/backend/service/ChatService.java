package com.app.chat.backend.service;

import com.app.chat.backend.dtos.ChatMessage;
import com.app.chat.backend.dtos.MessageDTO;
import java.util.List;

public interface ChatService {
    void sendMessage(ChatMessage message);

    List<MessageDTO> fetchConversationBetweenUser(Long senderId, Long receiverId);

    List<MessageDTO>fetchGroupConversation(Long groupId);

    void deleteMessageBetweenUsers(Long userId, Long opponentId);

    void deleteIndividualMessage(Long messageId, Long userId);

    void deleteGroupAllMessage(Long groupId);
}
