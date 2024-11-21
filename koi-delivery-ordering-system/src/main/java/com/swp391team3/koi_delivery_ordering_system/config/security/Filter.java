package com.swp391team3.koi_delivery_ordering_system.config.security;

import com.swp391team3.koi_delivery_ordering_system.exception.AuthException;
import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Manager;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.util.AntPathMatcher;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;

import java.io.IOException;
import java.util.List;
@Component
public class Filter extends OncePerRequestFilter {
    private final List<String> AUTH_PERMISSION = List.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/register-confirmation",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/images/**",
            "/api/fishes/getFishByOrderId/**",
            "/api/news/getAllNews",
            "/api/news/getNewsById/**",
            "/api/orders/getOrderById/**",
            "/api/orders/getOrderByStatus/**",
            "/api/orders/calculatePrice/**",
            "/api/orders/searchOrderByTrackingId/**",
            "/api/payment/**",
            "/api/ratings/create-new-ratings"
    );

    @Autowired
    TokenService tokenService;

    @Autowired
    HandlerExceptionResolver handlerExceptionResolver;

    public Filter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    public boolean isPublicAPI(String uri){
        AntPathMatcher patchMatch = new AntPathMatcher();
        return AUTH_PERMISSION.stream().anyMatch(pattren -> patchMatch.match(pattren, uri));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isPublicAPI = isPublicAPI(request.getRequestURI());
        if(isPublicAPI){
            filterChain.doFilter(request, response);
        } else {
            String token = getToken(request);
            if(token == null){
                handlerExceptionResolver.resolveException(request, response, null, new AuthException("Empty token"));
                return;
            }
            Object user;
            try {
                user = tokenService.getUserByToken(token);
            } catch (ExpiredJwtException e) {
                return;
            } catch (MalformedJwtException e) {
                return;
            }

            String username;
            if (user instanceof Customer) {
                username = ((Customer) user).getUsername();
            } else if (user instanceof DeliveryStaff) {
                username = ((DeliveryStaff) user).getUsername();
            } else if (user instanceof Manager) {
                username = ((Manager) user).getUsername();
            } else if (user instanceof SalesStaff) {
                username = ((SalesStaff) user).getUsername();
            } else {
                throw new IllegalArgumentException("Unknown user type");
            }


            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user,
                    token,
                    ((UserDetails) user).getAuthorities()
            );
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);
        }
    }

    public String getToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null) return null;
        return authHeader.substring(7);
    }
}