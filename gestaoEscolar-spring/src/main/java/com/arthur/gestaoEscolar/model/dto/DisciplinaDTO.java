package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Disciplina;
import lombok.Data;

@Data
public class DisciplinaDTO {
    private String id;
    private String nome;
    private Integer cargaHoraria;
    private String professorId;
    private String professorNome;

    // Construtor padrão para deserialização JSON
    public DisciplinaDTO() {
    }

    public DisciplinaDTO(Disciplina disciplina) {
        this.id = disciplina.getId();
        this.nome = disciplina.getNome();
        this.cargaHoraria = disciplina.getCargaHoraria();
        
        if (disciplina.getProfessor() != null) {
            this.professorId = disciplina.getProfessor().getId();
            this.professorNome = disciplina.getProfessor().getNome();
        }
    }
}
