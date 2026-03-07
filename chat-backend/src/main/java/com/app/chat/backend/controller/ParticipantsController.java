package com.app.chat.backend.controller;

import com.app.chat.backend.dtos.ConversationUserDTO;
import com.app.chat.backend.dtos.GroupDTO;
import com.app.chat.backend.dtos.GroupDetailsDTO;
import com.app.chat.backend.entity.User;
import com.app.chat.backend.service.ParticipantsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/")
public class ParticipantsController {

    private final ParticipantsService pService;

    public ParticipantsController(ParticipantsService pService) {
        this.pService = pService;
    }

    @PostMapping("add-archive-participants")
    public ResponseEntity<?> addArchivesParticipants(@RequestParam Long id, @AuthenticationPrincipal User user){
        System.out.println("archive" + id);
        pService.addArchiveParticipants(id , user.getId());
        return ResponseEntity.ok("OK");
    }

    @PostMapping("add-favourites-participants")
    public ResponseEntity<?> addFavouritesParticipants(@RequestParam Long id, @AuthenticationPrincipal User user){
        System.out.println("fav " + id);
        pService.addFavouritesParticipants(id , user.getId());
        return ResponseEntity.ok("OK");
    }

    @GetMapping("favourites-participants")
    public ResponseEntity<List<ConversationUserDTO>> fetchFavParticipants(@AuthenticationPrincipal User user){
        List<ConversationUserDTO> participantsFList = pService.favouritesParticipants(user.getId());
        return ResponseEntity.ok(participantsFList);
    }

    @GetMapping("archive-participants")
    public ResponseEntity<List<ConversationUserDTO>> fetchArchParticipants(@AuthenticationPrincipal User user){
        List<ConversationUserDTO> participantsAList = pService.archiveParticipants(user.getId());
        return ResponseEntity.ok(participantsAList);
    }

    @GetMapping("all-participants")
    public ResponseEntity<List<ConversationUserDTO>> fetchAllParticipants(@AuthenticationPrincipal User user){
        List<ConversationUserDTO> allParticipantsList = pService.allParticipants(user.getId());
        return ResponseEntity.ok(allParticipantsList);
    }

    @GetMapping("fetchGroups")
    public ResponseEntity<List<GroupDetailsDTO>> fetchAllGroups(@AuthenticationPrincipal User user){
        List<GroupDetailsDTO> allParticipantsList = pService.allGroups(user.getId());
        return ResponseEntity.ok(allParticipantsList);
    }

    @PutMapping("exit-from-group")
    public ResponseEntity<?> exitFromGroup(@RequestParam Long groupId , @AuthenticationPrincipal User user){
        System.out.println(groupId);
        pService.exitUserFromGroup(groupId , user.getId());
        return ResponseEntity.ok("Removed");
    }

    @PostMapping("add-group")
    public ResponseEntity<?> createGroup(@RequestBody GroupDTO groupDTO,@AuthenticationPrincipal User user){
        System.out.println(groupDTO.getMembers().getFirst());
        pService.createGroup(groupDTO , user.getId());
        return ResponseEntity.ok("group created");
    }

    @GetMapping("unarchived")
    public ResponseEntity<List<ConversationUserDTO>> unArchived(@RequestParam Long id, @AuthenticationPrincipal User user){
        List<ConversationUserDTO> archivedList = pService.makeUnarchived(id, user.getId());
        return ResponseEntity.ok(archivedList);
    }
}
