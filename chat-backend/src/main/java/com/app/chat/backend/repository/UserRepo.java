package com.app.chat.backend.repository;

import com.app.chat.backend.dtos.ConversationUserDTO;
import com.app.chat.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepo extends JpaRepository<User,Long> {
    User findByUserName(String username);
    @Query("""
        SELECT u FROM User u
        WHERE u.id <> :id
        AND u.id NOT IN (
            SELECT ap.archiveUser.id
            FROM ArchiveParticipant ap
            WHERE ap.user.id = :id
        )
    """)
    List<User> findByIdNotAndNotArchivedBy(Long id);

    @Query("""
       SELECT COUNT(u) > 0 FROM User u
       WHERE u.userName = :userName
       """)
    boolean isUserNameExist(String userName);

    User findByEmailId(String emailId);
}
