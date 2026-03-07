package com.app.chat.backend.controller;

import com.app.chat.backend.dtos.LoginRequestDTO;
import com.app.chat.backend.dtos.OtpDTO;
import com.app.chat.backend.dtos.UserDTO;
import com.app.chat.backend.dtos.UserRequestDTO;
import com.app.chat.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("signup")
    public ResponseEntity<UserDTO> doSignUp(@RequestBody UserRequestDTO requestDTO){
        UserDTO user = authService.signUp(requestDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("login")
    public ResponseEntity<UserDTO> doLogin(@RequestBody  LoginRequestDTO requestDTO, HttpServletResponse response){
        System.out.println(requestDTO.getEmailId());
        UserDTO responseDTO = authService.login(requestDTO,response);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("validate-username")
    public ResponseEntity<?> validateUsername(@RequestParam String userName){
        boolean isExist = authService.isUserNameExist(userName);
        return ResponseEntity.ok(isExist);
    }

    @PostMapping("validateOtp")
    public ResponseEntity<?> validateOtp(@RequestBody OtpDTO otp){
        System.out.println(otp.getEmailId());
        boolean isValidated = authService.doOtpValidate(otp);
        if(isValidated){
            return ResponseEntity.ok("Otp Validated");
        }
        return ResponseEntity.notFound().build();
    }
}
