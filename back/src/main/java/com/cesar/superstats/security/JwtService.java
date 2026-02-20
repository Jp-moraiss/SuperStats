package com.cesar.superstats.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// Service responsável por manipular o ciclo de vida do Token JWT.
@Service
public class JwtService {

    @Value("${secret.jwt.key}")
    private String secretKey;

    // Pega o username (Subject) contido no token.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Método genérico para extrair qualquer informação (Claim) do payload do token.
     * Utiliza Functional Interface para resolver qual claim específica queremos.
     * * @param claimsResolver Função que define qual dado buscar (ex: Claims::getExpiration)
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Gera um token apenas com os dados básicos do usuário (sem claims extras).
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Constrói o token JWT final.
     * Define: Claims (dados), Subject (quem é), Data de emissão, Expiração e Assinatura.
     * * @param extraClaims Map para adicionar informações customizadas no payload (ex: roles, id do cliente)
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valida se o token pertence ao usuário que está tentando autenticar
     * e se o token ainda não expirou.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Compara o user do token com o user do banco de dados (UserDetails)
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Faz o parse do token para ler todas as informações (Claims).
     * Lança exceções se o token for inválido ou expirado
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey()) // Define a chave para verificar a assinatura
                .build()
                .parseClaimsJws(token) // Valida a assinatura e estrutura
                .getBody();
    }

    /**
     * Decodifica a chave secreta que está em Base64 e retorna um objeto Key
     * compatível com o algoritmo HMAC-SHA.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}