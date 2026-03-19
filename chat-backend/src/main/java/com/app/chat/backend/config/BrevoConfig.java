package com.app.chat.backend.config;

import brevo.ApiClient;
import brevo.auth.ApiKeyAuth;
import brevoApi.TransactionalEmailsApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BrevoConfig {

    @Value(("${brevo.api-key}"))
    private String apiKey;

    @Bean
    public TransactionalEmailsApi transactionalEmailsApi(){

        ApiClient client = brevo.Configuration.getDefaultApiClient();
        ApiKeyAuth auth = (ApiKeyAuth) client.getAuthentication("api-key");
        auth.setApiKey(apiKey);
        return new TransactionalEmailsApi(client);
    }

}