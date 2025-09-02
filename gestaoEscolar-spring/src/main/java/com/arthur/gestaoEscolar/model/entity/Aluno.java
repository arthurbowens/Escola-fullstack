package com.arthur.gestaoEscolar.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Aluno extends Usuario {

    @NotBlank(message = "A matrícula não pode ser vazia ou apenas espaços em branco.")
    @Column(unique = true)
    private String matricula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id")
    private Turma turma;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas = new ArrayList<>();

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Frequencia> frequencias = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        this.setTipoUsuario(TipoUsuario.ALUNO);
    }
}
