package com.app.chat.backend.config;

import com.app.chat.backend.entity.User;
import com.app.chat.backend.repository.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Configuration
public class AuthFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserRepo userDB;

    public AuthFilter(JwtConfig jwtConfig, UserRepo userDB) {
        this.jwtConfig = jwtConfig;
        this.userDB = userDB;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if(request.getRequestURI().equals("/api/user/login") || request.getRequestURI().equals("/api/user/signup") || request.getRequestURI().equals("/api/user/validate-username")
            || request.getRequestURI().equals("/api/user/validateOtp")){
            filterChain.doFilter(request,response);
            return ;
        }

        String jwtToken = null;
        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if("jwt".equals(cookie.getName())){
                    jwtToken = cookie.getValue();
                }
            }
        }



        if(jwtToken != null){
            String userName = jwtConfig.getUsernameFromToken(jwtToken);
            if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){

                User user = userDB.findByUserName(userName);

                if(user != null){
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user , null , null);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }else{
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access Denied");
            }
        }else{
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Access Denied");
            return;
        }
        filterChain.doFilter(request , response);
    }

}
