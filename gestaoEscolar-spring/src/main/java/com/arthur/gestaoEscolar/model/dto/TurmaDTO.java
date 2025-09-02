package com.arthur.gestaoEscolar.model.dto;

import com.arthur.gestaoEscolar.model.entity.Turma;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TurmaDTO {

    private String id;
    private String nome;
    private String serie;
    private Integer anoLetivo;
    private LocalDate dataCriacao;
    private LocalDate dataAtualizacao;
    private List<String> alunosIds;
    private List<String> alunosNomes;
    private List<String> disciplinasIds;
    private List<String> disciplinasNomes;

    public TurmaDTO(Turma turma) {
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.serie = turma.getSerie();
        this.anoLetivo = turma.getAnoLetivo();
        this.dataCriacao = turma.getDataCriacao();
        this.dataAtualizacao = turma.getDataAtualizacao();
        
        if (turma.getAlunos() != null) {
            this.alunosIds = turma.getAlunos().stream()
                    .map(a -> a.getId())
                    .collect(Collectors.toList());
            this.alunosNomes = turma.getAlunos().stream()
                    .map(a -> a.getNome())
                    .collect(Collectors.toList());
        }
        
        if (turma.getDisciplinas() != null) {
            this.disciplinasIds = turma.getDisciplinas().stream()
                    .map(d -> d.getId())
                    .collect(Collectors.toList());
            this.disciplinasNomes = turma.getDisciplinas().stream()
                    .map(d -> d.getNome())
                    .collect(Collectors.toList());
        }
    }
}
