package com.utipdam.mobility.config;

import com.utipdam.mobility.business.OrderBusiness;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

public class ApiKeyFilter extends OncePerRequestFilter {
    private final OrderBusiness orderBusiness;

    public ApiKeyFilter(OrderBusiness orderBusiness) {
        this.orderBusiness = orderBusiness;
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        var path = request.getRequestURI();
        return !path.contains("/premium");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws
            ServletException, IOException {

        String reqApiKey = request.getHeader("Api-Key");
        if (reqApiKey == null){
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid API Key");
            return;
        }
        boolean isApiKeyValid = orderBusiness.validateApiKey(UUID.fromString(reqApiKey));

        if(!isApiKeyValid) {
            //return 401 Unauthorized
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid API Key");
            return;
        }

        //apiKey is valid. Signal to Spring Security, this is an authenticated request
        var authenticationToken = new UsernamePasswordAuthenticationToken(reqApiKey,
                reqApiKey, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        //continue process the request
        filterChain.doFilter(request, response);
    }
}