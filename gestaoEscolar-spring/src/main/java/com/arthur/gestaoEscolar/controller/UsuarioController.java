package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.dto.UsuarioDTO;
import com.arthur.gestaoEscolar.model.entity.Usuario;
import com.arthur.gestaoEscolar.model.entity.TipoUsuario;
import com.arthur.gestaoEscolar.service.UsuarioService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioDTO>> buscarTodos() {
        try {
            List<Usuario> usuarios = usuarioService.buscarTodos();
            List<UsuarioDTO> usuariosDTO = usuarios.stream()
                    .map(UsuarioDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(usuariosDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable String id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(new UsuarioDTO(usuario));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/tipo/{tipoUsuario}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioDTO>> buscarPorTipo(@PathVariable TipoUsuario tipoUsuario) {
        try {
            List<Usuario> usuarios = usuarioService.buscarPorTipo(tipoUsuario);
            List<UsuarioDTO> usuariosDTO = usuarios.stream()
                    .map(UsuarioDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(usuariosDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    // Permitir criação livre apenas para o primeiro usuário (administrador)
    public ResponseEntity<UsuarioDTO> salvar(@RequestBody Usuario usuario) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioDTO(usuarioSalvo));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/com-confirmacao")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioDTO> salvarComConfirmacao(@RequestBody Usuario usuario, @RequestParam String confirmarSenha) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario, confirmarSenha);
            return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioDTO(usuarioSalvo));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> atualizar(@PathVariable String id, @RequestBody Usuario usuario) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizar(id, usuario);
            return ResponseEntity.ok(new UsuarioDTO(usuarioAtualizado));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            usuarioService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/ativar-desativar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> ativarDesativar(@PathVariable String id) {
        try {
            usuarioService.ativarDesativar(id);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getMe() {
        try {
            // Este método será implementado quando criarmos o AuthService
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
