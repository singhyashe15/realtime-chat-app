package com.app.chat.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String userName;
    private String emailId;
    private String password;
//    private boolean isOnline;


    public User(String name, String userName, String emailId, String password) {
        this.name = name;
        this.userName = userName;
        this.emailId = emailId;
        this.password = password;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FavouriteParticipant> favourites;

    @OneToMany(mappedBy = "favouriteUser")
    private List<FavouriteParticipant> favouritedBy;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ArchiveParticipant> archives;

    @OneToMany(mappedBy = "archiveUser")
    private List<ArchiveParticipant> archivedBy;

    @OneToMany(mappedBy = "groupMembers")
    private List<GroupParticipant> groupParticipants;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return userName;
    }
}
