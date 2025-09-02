package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.dto.UsuarioDTO;
import com.arthur.gestaoEscolar.model.entity.Usuario;
import com.arthur.gestaoEscolar.service.UsuarioService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import com.arthur.gestaoEscolar.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String senha = loginRequest.get("senha");

            if (email == null || senha == null) {
                return ResponseEntity.badRequest().body("Email e senha são obrigatórios");
            }

            // Autentica o usuário
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, senha)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Busca os dados do usuário
            Usuario usuario = usuarioService.buscarPorEmail(email);

            // Gera o token JWT
            String token = jwtUtil.generateToken(email, usuario.getTipoUsuario().name());

            // Retorna APENAS o token como string pura, sem formatação
            return ResponseEntity.ok(token);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas: " + e.getMessage());
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registro(@RequestBody Usuario usuario) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario);
            UsuarioDTO usuarioDTO = new UsuarioDTO(usuarioSalvo);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuário registrado com sucesso");
            response.put("usuario", usuarioDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (GestaoEscolarException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao registrar usuário");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/registro-com-confirmacao")
    public ResponseEntity<Map<String, Object>> registroComConfirmacao(@RequestBody Usuario usuario, @RequestParam String confirmarSenha) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario, confirmarSenha);
            UsuarioDTO usuarioDTO = new UsuarioDTO(usuarioSalvo);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuário registrado com sucesso");
            response.put("usuario", usuarioDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (GestaoEscolarException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao registrar usuário");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<Map<String, Object>> verificarEmail(@RequestParam String email) {
        try {
            boolean emailExiste = usuarioService.buscarPorEmail(email) != null;
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("disponivel", !emailExiste);
            response.put("message", emailExiste ? "Email já está em uso" : "Email disponível");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Se não encontrar o usuário, o email está disponível
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("disponivel", true);
            response.put("message", "Email disponível");

            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        SecurityContextHolder.clearContext();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logout realizado com sucesso");
        
        return ResponseEntity.ok(response);
    }
}
