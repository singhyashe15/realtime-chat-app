package com.app.chat.backend.service;

import com.app.chat.backend.dtos.ConversationUserDTO;
import com.app.chat.backend.dtos.GroupDTO;
import com.app.chat.backend.dtos.GroupDetailsDTO;
import com.app.chat.backend.dtos.PairDTO;
import com.app.chat.backend.entity.*;
import com.app.chat.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ParticipantsService {
    private final UserRepo userDB;
    private final FavParticipantRepo favDB;
    private final ArchiveParticipantRepo archiveDB;
    private final GroupRepo groupDB;
    private final GroupParticipantRepo participantRepo;
    private final ConversationRepo convDB;
    private final MessageRepo messageDB;

    public ParticipantsService(UserRepo userDB, FavParticipantRepo favDB, ArchiveParticipantRepo archiveDB, GroupRepo groupDB, GroupParticipantRepo participantRepo, ConversationRepo convDB, MessageRepo messageDB) {
        this.userDB = userDB;
        this.favDB = favDB;
        this.archiveDB = archiveDB;
        this.groupDB = groupDB;
        this.participantRepo = participantRepo;
        this.convDB = convDB;
        this.messageDB = messageDB;
    }

    public List<ConversationUserDTO> favouritesParticipants(Long id) {
        User user = userDB.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getFavourites()
                .stream()
                .map(fav -> new ConversationUserDTO(
                        fav.getFavouriteUser().getId(),
                        fav.getFavouriteUser().getName()
                ))
                .toList();
    }

    public List<ConversationUserDTO> archiveParticipants(Long id) {
        User user = userDB.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getArchives()
                .stream()
                .map(archive -> new ConversationUserDTO(
                        archive.getArchiveUser().getId(),
                        archive.getArchiveUser().getName()
                ))
                .toList();
    }

    public List<ConversationUserDTO> allParticipants(Long id) {
        List<User>userList =  userDB.findByIdNotAndNotArchivedBy(id);
        System.out.println(userList.getLast().getUsername());
        List<ConversationUserDTO> convList = new ArrayList<>();
        for(User user : userList){
            Conversation conv = convDB.findConversationBetweenUsers(id , user.getId());
            if(conv != null){
                Message msg = messageDB.findLastConversation(conv.getId());
                convList.add(new ConversationUserDTO(
                        user.getId() , user.getName()  ,msg.getText() , msg.getCreatedAt()
                ));
            }else{
                convList.add(new ConversationUserDTO(
                        user.getId() , user.getName() ,  "" , null
                ));
            }
        }
        return convList;
    }

    public List<GroupDetailsDTO> allGroups(Long id) {
        try{
            User user = userDB.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<GroupParticipant> groupList = participantRepo.findByGroupMembers(user);
            return groupList.stream()
                    .map(participant -> new GroupDetailsDTO(
                            participant.getGroup().getId() , participant.getGroup().getGroupName() ,participant.getGroup().getCreatedBy().getId(), participant.getGroup().getParticipants().stream()
                            .map(p -> new PairDTO(
                                    p.getGroupMembers().getId() , p.getGroupMembers().getName()
                            )).toList()
                    )).toList();
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void addFavouritesParticipants(Long fav_id, Long user_id) {
        User user = userDB.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User fav_user = userDB.findById(fav_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FavouriteParticipant participant = new FavouriteParticipant();
        participant.setUser(user);
        participant.setFavouriteUser(fav_user);
        favDB.save(participant);
    }

    @Transactional
    public void addArchiveParticipants(Long archiveUserId, Long archivedByUserId) {
        User user = userDB.findById(archivedByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User archive_user = userDB.findById(archiveUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ArchiveParticipant participant = new ArchiveParticipant();
        participant.setUser(user);
        participant.setArchiveUser(archive_user);
        archiveDB.save(participant);
    }

    @Transactional
    public void createGroup(GroupDTO groupDTO, Long id) {
        // created User
        User user = userDB.findById(id)
                .orElseThrow(() -> new RuntimeException(("User not found")));

        Group group = new Group();
        group.setGroupName(groupDTO.getGroupName());
        group.setCreatedBy(user);

        Group savedGroup = groupDB.save(group);

        // saving each user along with groupId
        for(long memberId : groupDTO.getMembers()){
            User member = userDB.findById(memberId)
                    .orElseThrow(() -> new RuntimeException(("User not found")));

            GroupParticipant participant = new GroupParticipant();
            participant.setGroup(savedGroup);
            participant.setGroupMembers(member);
            savedGroup.getParticipants().add(participant);
        }
        // saving createdUser also
        GroupParticipant creatorParticipant = new GroupParticipant();
        creatorParticipant.setGroup(savedGroup);
        creatorParticipant.setGroupMembers(user);
        savedGroup.getParticipants().add(creatorParticipant);

        groupDB.save(savedGroup);
    }

    @Transactional
    public List<ConversationUserDTO> makeUnarchived(Long archivedUserId,Long archivedByUserId) {

        List<ArchiveParticipant> participant = archiveDB.findByUserId(archivedByUserId);

        Optional<ArchiveParticipant> participant1 = participant.stream()
                .filter(p -> p.getArchiveUser().getId().equals(archivedUserId))
                .findFirst();

        participant1.ifPresent(archiveParticipant -> archiveDB.deleteById(archiveParticipant.getId()));

        return participant.stream()
                .filter(p -> !p.getArchiveUser().getId().equals(archivedUserId))
                .map(p -> new ConversationUserDTO(
                        p.getArchiveUser().getId(),
                        p.getArchiveUser().getName()
                )).toList();
    }

    public void exitUserFromGroup(Long groupId, Long userId) {
        try{
            GroupParticipant participant = participantRepo.findByIdAndGroupMembersId(groupId, userId);
            System.out.println(participant.getId());
            participantRepo.deleteById(participant.getId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
