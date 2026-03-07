package com.app.chat.backend.repository;

import com.app.chat.backend.entity.Group;
import com.app.chat.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupRepo extends JpaRepository<Group, Long> {
    List<Group> findByCreatedBy(User createdUser);
}
