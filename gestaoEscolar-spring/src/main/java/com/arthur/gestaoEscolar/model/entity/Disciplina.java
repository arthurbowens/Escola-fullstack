package com.arthur.gestaoEscolar.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disciplinas")
@Data
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "O nome da disciplina não pode ser vazio ou apenas espaços em branco.")
    @Column(unique = true)
    private String nome;

    @NotNull(message = "A carga horária não pode ser nula.")
    @Positive(message = "A carga horária deve ser um valor positivo.")
    @Column(name = "carga_horaria", nullable = false)
    private Integer cargaHoraria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id")
    @JsonIgnore
    private Professor professor;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao = LocalDate.now();

    @Column(name = "data_atualizacao")
    private LocalDate dataAtualizacao = LocalDate.now();

    @OneToMany(mappedBy = "disciplina", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Nota> notas = new ArrayList<>();

    @OneToMany(mappedBy = "disciplina", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Frequencia> frequencias = new ArrayList<>();

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
