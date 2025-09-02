package com.arthur.gestaoEscolar.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "turmas")
@Data
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "O nome da turma não pode ser vazio ou apenas espaços em branco.")
    @Column(unique = true)
    private String nome;

    @NotBlank(message = "A série não pode ser vazia ou apenas espaços em branco.")
    @Column(nullable = false)
    private String serie;

    @NotNull(message = "O ano letivo não pode ser nulo.")
    @Column(name = "ano_letivo", nullable = false)
    private Integer anoLetivo;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao = LocalDate.now();

    @Column(name = "data_atualizacao")
    private LocalDate dataAtualizacao = LocalDate.now();

    @OneToMany(mappedBy = "turma", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Aluno> alunos = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "turma_disciplinas",
        joinColumns = @JoinColumn(name = "turma_id"),
        inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private List<Disciplina> disciplinas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDate.now();
        dataAtualizacao = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDate.now();
    }
}
