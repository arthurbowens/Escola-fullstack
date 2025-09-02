package com.arthur.gestaoEscolar.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Professor extends Usuario {

    @NotBlank(message = "O CPF não pode ser vazio ou apenas espaços em branco.")
    @Column(unique = true, length = 14)
    private String cpf;

    @Column(name = "formacao_academica")
    private String formacaoAcademica;

    @Column(name = "telefone")
    private String telefone;

    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Disciplina> disciplinas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        this.setTipoUsuario(TipoUsuario.PROFESSOR);
    }
}
