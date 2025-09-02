package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Usuario;
import com.arthur.gestaoEscolar.model.entity.TipoUsuario;
import com.arthur.gestaoEscolar.model.repository.UsuarioRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.buscarPorEmail(username);
    }

    public Usuario buscarPorId(String id) throws GestaoEscolarException {
        return this.usuarioRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Usuário não encontrado"));
    }

    public List<Usuario> buscarTodos() throws GestaoEscolarException {
        List<Usuario> usuarios = this.usuarioRepository.findAll();
        if (usuarios.isEmpty()) {
            throw new GestaoEscolarException("Nenhum usuário encontrado");
        }
        return usuarios;
    }

    public Usuario buscarPorEmail(String email) throws UsernameNotFoundException {
        return this.usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado pelo email"));
    }

    public List<Usuario> buscarPorTipo(TipoUsuario tipoUsuario) throws GestaoEscolarException {
        List<Usuario> usuarios = this.usuarioRepository.findByTipoUsuario(tipoUsuario);
        if (usuarios.isEmpty()) {
            throw new GestaoEscolarException("Nenhum usuário do tipo " + tipoUsuario + " encontrado");
        }
        return usuarios;
    }

    public Usuario salvar(Usuario usuario) throws GestaoEscolarException {
        this.verificarEmailJaUtilizado(usuario.getEmail(), usuario.getId());
        
        // Validação de segurança: apenas administradores podem criar outros administradores
        if (usuario.getTipoUsuario() == TipoUsuario.ADMINISTRADOR) {
            // Verificar se já existe algum usuário no sistema
            long totalUsuarios = usuarioRepository.count();
            if (totalUsuarios > 0) {
                // Se já existem usuários, verificar se o usuário atual é administrador
                // Por enquanto, vamos permitir apenas se for o primeiro usuário
                throw new GestaoEscolarException("Apenas administradores existentes podem criar novos administradores");
            }
        }
        
        if (usuario.getSenha() != null && !usuario.getSenha().trim().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        
        return usuarioRepository.save(usuario);
    }

    public Usuario salvar(Usuario usuario, String confirmarSenha) throws GestaoEscolarException {
        this.verificarEmailJaUtilizado(usuario.getEmail(), usuario.getId());
        
        if (!usuario.getSenha().equals(confirmarSenha)) {
            throw new GestaoEscolarException("As senhas precisam ser iguais");
        }
        
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(String id, Usuario usuario) throws GestaoEscolarException {
        Usuario usuarioEditado = this.buscarPorId(id);

        usuarioEditado.setNome(Optional.ofNullable(usuario.getNome()).orElse(usuarioEditado.getNome()));
        usuarioEditado.setDataNascimento(Optional.ofNullable(usuario.getDataNascimento()).orElse(usuarioEditado.getDataNascimento()));
        usuarioEditado.setEmail(Optional.ofNullable(usuario.getEmail()).orElse(usuarioEditado.getEmail()));
        
        if (usuario.getSenha() != null && !usuario.getSenha().trim().isEmpty()) {
            usuarioEditado.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }

        return this.salvar(usuarioEditado);
    }

    public void excluir(String id) throws GestaoEscolarException {
        this.buscarPorId(id);
        this.usuarioRepository.deleteById(id);
    }

    public void ativarDesativar(String id) throws GestaoEscolarException {
        Usuario usuario = this.buscarPorId(id);
        usuario.setAtivo(!usuario.getAtivo());
        this.usuarioRepository.save(usuario);
    }

    public void verificarEmailJaUtilizado(String email, String idUsuarioAtual) throws GestaoEscolarException {
        boolean emailJaUtilizado;

        if (idUsuarioAtual == null) {
            emailJaUtilizado = this.usuarioRepository.existsByEmail(email);
        } else {
            emailJaUtilizado = this.usuarioRepository.existsByEmailAndIdNot(email, idUsuarioAtual);
        }

        if (emailJaUtilizado) {
            throw new GestaoEscolarException("Não pode utilizar um e-mail já cadastrado!");
        }
    }
}
