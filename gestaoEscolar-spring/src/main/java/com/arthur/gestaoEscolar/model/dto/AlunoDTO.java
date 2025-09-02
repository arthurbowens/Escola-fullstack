package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Aluno;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AlunoDTO extends UsuarioDTO {

    private String matricula;
    private String turmaId;
    private String turmaNome;

    public AlunoDTO(Aluno aluno) {
        super(aluno);
        this.matricula = aluno.getMatricula();
        if (aluno.getTurma() != null) {
            this.turmaId = aluno.getTurma().getId();
            this.turmaNome = aluno.getTurma().getNome();
        }
    }
}
