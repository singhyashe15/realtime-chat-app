package com.app.chat.backend.service;

import com.app.chat.backend.dtos.LoginRequestDTO;
import com.app.chat.backend.entity.User;
import com.app.chat.backend.repository.UserRepo;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AuthenticationManager authenticationManager;
    private final UserRepo db;

    public CustomUserDetailsService(@Lazy  AuthenticationManager authenticationManager, UserRepo db) {
        this.authenticationManager = authenticationManager;
        this.db = db;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = db.findByUserName(username);
        if(user != null){
            return (UserDetails) user;
        }
        throw new UsernameNotFoundException("User not exists");
    }

    public User authenticate(LoginRequestDTO requestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            requestDTO.getUserName(),
                            requestDTO.getPassword()
                    )
            );
            return (User) authentication.getPrincipal();

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
