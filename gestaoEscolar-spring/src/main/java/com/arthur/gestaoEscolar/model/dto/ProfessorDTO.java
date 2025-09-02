package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Professor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProfessorDTO extends UsuarioDTO {

    private String cpf;
    private String senha;
    private String formacaoAcademica;
    private String telefone;
    private List<String> disciplinasIds;
    private List<String> disciplinasNomes;

    // Construtor padrão para deserialização JSON
    public ProfessorDTO() {
        super();
    }

    public ProfessorDTO(Professor professor) {
        super(professor);
        this.cpf = professor.getCpf();
        this.formacaoAcademica = professor.getFormacaoAcademica();
        this.telefone = professor.getTelefone();
        
        if (professor.getDisciplinas() != null) {
            this.disciplinasIds = professor.getDisciplinas().stream()
                    .map(d -> d.getId())
                    .collect(Collectors.toList());
            this.disciplinasNomes = professor.getDisciplinas().stream()
                    .map(d -> d.getNome())
                    .collect(Collectors.toList());
        }
    }
}
