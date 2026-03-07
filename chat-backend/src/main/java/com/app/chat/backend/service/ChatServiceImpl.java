package com.app.chat.backend.service;

import com.app.chat.backend.config.RabbitMQConfig;
import com.app.chat.backend.dtos.ChatMessage;
import com.app.chat.backend.dtos.MessageDTO;
import com.app.chat.backend.entity.Conversation;
import com.app.chat.backend.entity.Group;
import com.app.chat.backend.entity.Message;
import com.app.chat.backend.entity.User;
import com.app.chat.backend.repository.ConversationRepo;
import com.app.chat.backend.repository.GroupRepo;
import com.app.chat.backend.repository.MessageRepo;
import com.app.chat.backend.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService{
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepo userDB;
    private final ConversationRepo convDB;
    private final MessageRepo messageDB;
    private final GroupRepo groupDB;

    public ChatServiceImpl(SimpMessagingTemplate messagingTemplate, UserRepo userDB, ConversationRepo convDB, MessageRepo messageDB, GroupRepo groupDB) {
        this.messagingTemplate = messagingTemplate;
        this.userDB = userDB;
        this.convDB = convDB;
        this.messageDB = messageDB;
        this.groupDB = groupDB;
    }

    @Override
    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void sendMessage(ChatMessage message) {
        if(message.getReceiverId() == null){
            MessageDTO messageDTO = storeGroupMessage(message);
            messagingTemplate.convertAndSend("/topic/messages." + message.getGroupId() , messageDTO);
        }else{
            MessageDTO messageDTO = storePrivateMessage(message);
            Optional<User> userReceiver = userDB.findById(message.getReceiverId());
            messagingTemplate.convertAndSend("/topic/messages." + userReceiver.get().getId(), messageDTO);
        }
    }

    private MessageDTO storeGroupMessage(ChatMessage message) {
        try{
            Conversation conv = convDB.findConversationInGroup(message.getSenderId() , message.getGroupId());
            Optional<User> userSender = userDB.findById(message.getSenderId());
            if(conv == null){
                Optional<Group> groupInfo = groupDB.findById(message.getGroupId());
                conv = new Conversation();
                conv.setSender(userSender.get());
                conv.setGroup(groupInfo.get());
                convDB.save(conv);
            }
            Message msg = new Message(message.getText() , message.getImageUrl(), message.getVideoUrl(), userSender.get(), conv);
            Message msg1 = messageDB.save(msg);
            return new MessageDTO(msg1.getId() , msg.getUser().getId() ,msg.getUser().getName() , msg.getText(), msg.getImageUrl(),msg.getVideoUrl(),msg.getCreatedAt());
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private MessageDTO storePrivateMessage(ChatMessage message){
        try{
            Conversation conv = convDB.findConversationBetweenUsers(message.getSenderId(),message.getReceiverId());
            Optional<User> userSender = userDB.findById(message.getSenderId());
            if(conv == null && userSender.isPresent()){
                conv = new Conversation();
                Optional<User> userReceiver = userDB.findById(message.getReceiverId());
                conv.setSender(userSender.get());
                conv.setReceiver(userReceiver.get());
                convDB.save(conv);
            }
            Message msg = new Message(message.getText() , message.getImageUrl(), message.getVideoUrl(), userSender.get(), conv);
            Message msg1 = messageDB.save(msg);
            return new MessageDTO(msg1.getId() , msg.getUser().getId() ,msg.getUser().getName() , msg.getText(), msg.getImageUrl(),msg.getVideoUrl(),msg.getCreatedAt());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MessageDTO> fetchConversationBetweenUser(Long senderId, Long receiverId) {
        try{
            Conversation convUser = convDB.findConversationBetweenUsers(senderId , receiverId);
            if(convUser == null){
                return List.of();
            }

            List<Message> messageList = messageDB.findByConversationId(convUser.getId());
            return messageList.stream()
                    .filter(m -> m.getNotAllowedId() != senderId)
                    .map(m ->  new MessageDTO(
                            m.getId() ,  m.getUser().getId()  , m.getUser().getName() , m.getText(), m.getImageUrl(), m.getVideoUrl() , m.getCreatedAt()
                    )).toList();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public List<MessageDTO>fetchGroupConversation(Long groupId){
        try{
            Conversation convUser = convDB.findConversationInGroup(null , groupId);
            if(convUser == null){
                return List.of();
            }

            List<Message> messageList = messageDB.findByConversationId(convUser.getId());
            return messageList.stream()
                    .map(m -> new MessageDTO(
                            m.getId() ,  m.getUser().getId()  , m.getUser().getName() , m.getText(), m.getImageUrl(), m.getVideoUrl() , m.getCreatedAt()
                    )).toList();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteMessageBetweenUsers(Long userId, Long opponentId) {
        try{
            Conversation convBetweenUser = convDB.findConversationBetweenUsers(userId,opponentId);

            List<Message> msg = messageDB.findAllByConversationId(convBetweenUser.getId());

            for(Message m : msg){
                m.setText("This message was deleted");
                m.setImageUrl("");
                m.setVideoUrl("");
            }
            messageDB.saveAll(msg);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteIndividualMessage(Long messageId, Long userId) {
        try{
            Optional<Message> msg = messageDB.findById(messageId);
            if(msg.isPresent() && msg.get().getNotAllowedId() != null){
                messageDB.deleteById(messageId); // one user already delete the same message from his side so directly delete from the table
            }else{
                msg.get().setNotAllowedId(userId); // add the user id such that the message not shown to his page
                messageDB.save(msg.get());
            }
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteGroupAllMessage(Long groupId) {
        Conversation conv1 = convDB.findConversationInGroup(null,groupId);
        List<Message> msg = messageDB.findAllByConversationId(conv1.getId());

        for(Message m : msg){
            m.setText("This message was deleted");
            m.setImageUrl("");
            m.setVideoUrl("");
        }
        messageDB.saveAll(msg);
    }


}
