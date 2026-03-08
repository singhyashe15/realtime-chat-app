package com.app.chat.backend.service;

import com.app.chat.backend.config.JwtConfig;
import com.app.chat.backend.dtos.LoginRequestDTO;
import com.app.chat.backend.dtos.OtpDTO;
import com.app.chat.backend.dtos.UserDTO;
import com.app.chat.backend.dtos.UserRequestDTO;
import com.app.chat.backend.entity.User;
import com.app.chat.backend.repository.UserRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class AuthService {

    private final PasswordEncoder encoder;
    private final UserRepo db;
    private final CustomUserDetailsService userDetail;
    private final JwtConfig jwtConfig;
    private final RedisService redisService;

    public AuthService(PasswordEncoder encoder, UserRepo db, CustomUserDetailsService userDetail, JwtConfig jwtConfig, RedisService redisService) {
        this.encoder = encoder;
        this.db = db;
        this.userDetail = userDetail;
        this.jwtConfig = jwtConfig;
        this.redisService = redisService;
    }

    public UserDTO signUp(UserRequestDTO user) {
        User isFound = db.findByEmailId(user.getEmailId());
        if(isFound != null){
            throw new RuntimeException("user already exits");
        }

        user.setPassword(encoder.encode(user.getPassword()));
//      user.setOnline(false);
        redisService.setUserData("user::" + user.getEmailId(), user);
        generateOtp(user);
        return new UserDTO(user.getUserName(), user.getEmailId());
    }

    private void generateOtp(UserRequestDTO user) {
        Random random = new Random();
        String code =  String.valueOf(random.nextInt(99999 - 10000 + 1) + 10000);

        OtpDTO otp = new OtpDTO( user.getEmailId(), code);
        // for storing otp in redis dbs
        redisService.setOtp("otp::" + user.getEmailId(), otp);
    }

    public UserDTO login(LoginRequestDTO requestDTO, HttpServletResponse response) {
        User authenticatedUser = userDetail.authenticate(requestDTO);
        String token = jwtConfig.generateAccessToken(authenticatedUser);
        String cookieValue = "jwt=" + token +
                "; HttpOnly" +
                "; Secure" +
                "; Path=/" +
                "; Max-Age=" + (24 * 60 * 60) +
                "; SameSite=None";
        response.setHeader("Set-Cookie", cookieValue);

        return new UserDTO(authenticatedUser.getId(),authenticatedUser.getUsername(),authenticatedUser.getName(),authenticatedUser.getEmailId());
    }

    public boolean isUserNameExist(String userName) {
        boolean isExits = db.isUserNameExist(userName);
        return isExits;
    }

    public boolean doOtpValidate(OtpDTO otp) {
        OtpDTO fetchOtp = redisService.fetchOtp("otp::" + otp.getEmailId(), OtpDTO.class);
        System.out.println(fetchOtp.getCode());
        if(fetchOtp != null && fetchOtp.getCode().equals(otp.getCode())){
            UserRequestDTO user = redisService.getUserData("user::" + otp.getEmailId() , UserRequestDTO.class);
            User signedUser = new User(user.getName(),user.getUserName(),user.getEmailId(),user.getPassword());
            db.save(signedUser);
            return true;
        }
        return false;
    }
}
