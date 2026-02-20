package com.cesar.superstats.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Filtro que intercepta TODAS as requisições HTTP para validar o token JWT.
 * Estende OncePerRequestFilter para garantir uma única execução por request.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Verificação rápida: Se não tem header ou não é Bearer, passa a bola.
        // Isso permite que endpoints públicos (ex: /auth/login) funcionem sem token.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); // Remove o prefixo "Bearer "

        try {
            // Tenta extrair o username. Se o token for inválido/expirado, o jwtService lança exceção aqui.
            username = jwtService.extractUsername(jwt);

            // 2. Se achou username e o usuário AINDA não está autenticado no contexto atual:
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Busca os dados completos do usuário no banco
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 3. Valida se o token bate com o usuário e não expirou
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // Cria o objeto de autenticação do Spring Security
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credenciais (senha) são nulas pois já validamos via token
                            userDetails.getAuthorities()
                    );

                    // Adiciona detalhes da requisição (IP, Session ID)
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 4. "Loga" o usuário na memória do Spring Security para esta requisição
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            // Continua o fluxo normal da requisição (vai para o Controller ou próximo filtro)
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            // TRATAMENTO DE ERRO MANUAL:
            // Como estamos dentro de um Filtro (antes do Controller), o @ControllerAdvice global
            // muitas vezes não captura essa exceção. Precisamos escrever a resposta HTTP na mão.
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            // Nota: Em produção, seria ideal usar Jackson (ObjectMapper) aqui para não montar JSON na string
            String jsonPayload = String.format(
                    "{\"timestamp\":\"%s\", \"status\":401, \"error\":\"Unauthorized\", \"message\":\"Sessão expirada. Por favor, faça o login novamente.\"}",
                    LocalDateTime.now()
            );

            response.getWriter().write(jsonPayload);
        }
    }
}