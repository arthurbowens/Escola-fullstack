package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Frequencia;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FrequenciaDTO {
    private String id;
    private String alunoId;
    private String disciplinaId;
    private String disciplinaNome;
    private LocalDate dataAula;
    private Boolean presente;
    private String observacao;

    public FrequenciaDTO() {}

    public FrequenciaDTO(Frequencia frequencia) {
        this.id = frequencia.getId();
        this.alunoId = frequencia.getAluno() != null ? frequencia.getAluno().getId() : null;
        this.disciplinaId = frequencia.getDisciplina() != null ? frequencia.getDisciplina().getId() : null;
        this.disciplinaNome = frequencia.getDisciplina() != null ? frequencia.getDisciplina().getNome() : null;
        this.dataAula = frequencia.getDataAula();
        this.presente = frequencia.getPresente();
        this.observacao = frequencia.getObservacao();
    }
}
