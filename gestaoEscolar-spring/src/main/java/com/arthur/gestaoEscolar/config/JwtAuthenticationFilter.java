package com.arthur.gestaoEscolar.config;

import com.arthur.gestaoEscolar.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("🔐 JWT Filter executando para: " + request.getRequestURI());
        
        final String authorizationHeader = request.getHeader("Authorization");
        System.out.println("🔑 Authorization header: " + authorizationHeader);

        String username = null;
        String jwt = null;
        String tipoUsuario = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                tipoUsuario = jwtUtil.extractTipoUsuario(jwt);
                System.out.println("✅ Token válido para usuário: " + username + " com role: " + tipoUsuario);
            } catch (Exception e) {
                System.out.println("❌ Erro ao processar token: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ Sem header Authorization ou formato inválido");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + tipoUsuario))
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("🔓 Autenticação configurada para: " + username);
            }
        }

        filterChain.doFilter(request, response);
    }
}
