package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Usuario;
import com.arthur.gestaoEscolar.model.entity.TipoUsuario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsuarioDTO {

    private String id;
    private String nome;
    private LocalDate dataNascimento;
    private String email;
    private TipoUsuario tipoUsuario;
    private Boolean ativo;
    private LocalDate dataCriacao;
    private LocalDate dataAtualizacao;

    // Construtor padrão para deserialização JSON
    public UsuarioDTO() {
    }

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.dataNascimento = usuario.getDataNascimento();
        this.email = usuario.getEmail();
        this.tipoUsuario = usuario.getTipoUsuario();
        this.ativo = usuario.getAtivo();
        this.dataCriacao = usuario.getDataCriacao();
        this.dataAtualizacao = usuario.getDataAtualizacao();
    }
}
