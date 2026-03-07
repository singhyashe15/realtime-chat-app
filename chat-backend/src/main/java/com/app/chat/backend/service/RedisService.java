package com.app.chat.backend.service;

import com.app.chat.backend.dtos.OtpDTO;
import com.app.chat.backend.dtos.UserRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    @Autowired
    private RedisTemplate redisTemplate;

    public void setUserData(String key , UserRequestDTO user){
        try{
            ObjectMapper mapper = new ObjectMapper();
            String userJson = mapper.writeValueAsString(user);
            System.out.println(userJson);
            redisTemplate.opsForValue().set(key , userJson , 30 , TimeUnit.MINUTES);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public <T> T getUserData(String key , Class<T> userClass){
        try{
            ObjectMapper mapper = new ObjectMapper();
            Object userData = redisTemplate.opsForValue().get(key);
            return mapper.readValue(userData.toString() , userClass);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void setOtp(String key, OtpDTO otp) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(otp);
            redisTemplate.opsForValue().set(key, json , 5 , TimeUnit.MINUTES);
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public <T> T fetchOtp(String key, Class<T> entityClass) {
        try{
            Object otp = redisTemplate.opsForValue().get(key);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(otp.toString(), entityClass);
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException();
        }
    }
}
