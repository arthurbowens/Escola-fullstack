package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Nota;
import com.arthur.gestaoEscolar.model.entity.TipoAvaliacao;
import lombok.Data;

import java.time.LocalDate;

@Data
public class NotaDTO {
    private String id;
    private String alunoId;
    private String disciplinaId;
    private String disciplinaNome;
    private Double valor;
    private TipoAvaliacao tipoAvaliacao;
    private LocalDate dataAvaliacao;
    private String observacao;

    public NotaDTO() {}

    public NotaDTO(Nota nota) {
        this.id = nota.getId();
        this.alunoId = nota.getAluno() != null ? nota.getAluno().getId() : null;
        this.disciplinaId = nota.getDisciplina() != null ? nota.getDisciplina().getId() : null;
        this.disciplinaNome = nota.getDisciplina() != null ? nota.getDisciplina().getNome() : null;
        this.valor = nota.getValor();
        this.tipoAvaliacao = nota.getTipoAvaliacao();
        this.dataAvaliacao = nota.getDataAvaliacao();
        this.observacao = nota.getObservacao();
    }
}
