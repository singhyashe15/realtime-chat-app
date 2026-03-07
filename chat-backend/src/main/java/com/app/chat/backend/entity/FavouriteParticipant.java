package com.app.chat.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "favourites_participants")
@Setter
@Getter
public class FavouriteParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    // Who marked favourite
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Who is marked as favourite
    @ManyToOne
    @JoinColumn(name = "favourite_user_id", nullable = false)
    private User favouriteUser;

}
