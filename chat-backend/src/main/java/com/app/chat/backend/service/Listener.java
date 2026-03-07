package com.app.chat.backend.service;

import com.app.chat.backend.entity.User;
import com.app.chat.backend.repository.UserRepo;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Service
public class Listener {

//    private final UserRepo userDB;
//
//    public Listener(UserRepo userDB) {
//        this.userDB = userDB;
//    }
//
//    @EventListener
//    public void handleConnect(SessionConnectedEvent connect){
//        Principal user = connect.getUser();
//
//        if(user != null){
//            User user1 = userDB.findByUserName(user.getName());
//            user1.setOnline(true);
//            userDB.save(user1);
//        }
//    }
//
//    @EventListener
//    public void handleDisConnect(SessionDisconnectEvent disConnect){
//        Principal user = disConnect.getUser();
//
//        if(user != null){
//            User user1 = userDB.findByUserName(user.getName());
//            user1.setOnline(false);
//            userDB.save(user1);
//        }
//    }
}
