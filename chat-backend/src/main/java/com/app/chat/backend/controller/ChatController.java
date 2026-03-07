package com.app.chat.backend.controller;

import com.app.chat.backend.config.RabbitMQConfig;
import com.app.chat.backend.dtos.ChatMessage;
import com.app.chat.backend.dtos.ConversationUserDTO;
import com.app.chat.backend.dtos.MessageDTO;
import com.app.chat.backend.entity.User;
import com.app.chat.backend.service.ChatService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/")
public class ChatController {
    private final RabbitTemplate rabbitTemplate;
    private final ChatService chatService;

    public ChatController(RabbitTemplate rabbitTemplate, ChatService chatService) {
        this.rabbitTemplate = rabbitTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/private/chat.{id}")
    public void sendMessage(ChatMessage chatMessage, @DestinationVariable("id") String conversationId , Principal principal){
        System.out.println(principal.getName());
        System.out.println(chatMessage.getText());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                chatMessage
        );
    }

    @GetMapping("conversation")
    public ResponseEntity<?> getMessageBetweenUser(@RequestParam Long senderId , @RequestParam Long receiverId){
        List<MessageDTO>  messageList = chatService.fetchConversationBetweenUser(senderId , receiverId);
        return ResponseEntity.ok(messageList);
    }

    @GetMapping("group-conversation")
    public ResponseEntity<?> getGroupMessage(@RequestParam Long groupId){
        List<MessageDTO>  messageList = chatService.fetchGroupConversation(groupId);
        return ResponseEntity.ok(messageList);
    }

    @DeleteMapping("delete-all-messages")
    public ResponseEntity<?> deleteMessage(@RequestParam Long id , @AuthenticationPrincipal User user){
        chatService.deleteMessageBetweenUsers(user.getId() , id);
        return ResponseEntity.ok("all message deleted");
    }

    @DeleteMapping("delete-individual-message")
    public ResponseEntity<?> deleteIndividualMessage(@RequestParam Long messageId , @AuthenticationPrincipal User user){
        chatService.deleteIndividualMessage(messageId, user.getId());
        return ResponseEntity.ok("Message deleted");
    }

    @DeleteMapping("delete-all-group-messages")
    public ResponseEntity<?> deleteAllGroupMessage(@RequestParam Long groupId){
        chatService.deleteGroupAllMessage(groupId);
        return ResponseEntity.ok("all message deleted");
    }
}
