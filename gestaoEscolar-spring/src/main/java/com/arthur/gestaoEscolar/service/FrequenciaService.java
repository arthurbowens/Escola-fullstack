package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Frequencia;
import com.arthur.gestaoEscolar.model.entity.Aluno;
import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.dto.FrequenciaDTO;
import com.arthur.gestaoEscolar.model.repository.FrequenciaRepository;
import com.arthur.gestaoEscolar.model.repository.AlunoRepository;
import com.arthur.gestaoEscolar.model.repository.DisciplinaRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FrequenciaService {

    @Autowired
    private FrequenciaRepository frequenciaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Frequencia buscarPorId(String id) throws GestaoEscolarException {
        return this.frequenciaRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Frequência não encontrada"));
    }

    public List<Frequencia> buscarTodas() throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findAll();
        if (frequencias.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma frequência encontrada");
        }
        return frequencias;
    }

    public List<Frequencia> buscarPorAluno(String alunoId) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findByAlunoId(alunoId);
        // Retornar lista vazia ao invés de lançar exceção
        return frequencias;
    }

    public List<Frequencia> buscarPorDisciplina(String disciplinaId) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findByDisciplinaId(disciplinaId);
        if (frequencias.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma frequência encontrada para esta disciplina");
        }
        return frequencias;
    }

    public List<Frequencia> buscarPorAlunoEDisciplina(String alunoId, String disciplinaId) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findByAlunoAndDisciplinaOrderByData(alunoId, disciplinaId);
        if (frequencias.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma frequência encontrada para este aluno nesta disciplina");
        }
        return frequencias;
    }

    public List<Frequencia> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findByPeriodo(dataInicio, dataFim);
        if (frequencias.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma frequência encontrada para o período especificado");
        }
        return frequencias;
    }

    public List<Frequencia> buscarPorAlunoEPeriodo(String alunoId, LocalDate dataInicio, LocalDate dataFim) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.frequenciaRepository.findByAlunoAndPeriodo(alunoId, dataInicio, dataFim);
        if (frequencias.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma frequência encontrada para este aluno no período especificado");
        }
        return frequencias;
    }

    public Long contarPresencas(String alunoId, String disciplinaId) throws GestaoEscolarException {
        return this.frequenciaRepository.countPresencasByAlunoAndDisciplina(alunoId, disciplinaId);
    }

    public Long contarTotalAulas(String alunoId, String disciplinaId) throws GestaoEscolarException {
        return this.frequenciaRepository.countTotalAulasByAlunoAndDisciplina(alunoId, disciplinaId);
    }

    public Double calcularPercentualPresenca(String alunoId, String disciplinaId) throws GestaoEscolarException {
        Optional<Double> percentual = this.frequenciaRepository.calcularPercentualPresenca(alunoId, disciplinaId);
        return percentual.orElse(0.0);
    }

    public Frequencia salvar(Frequencia frequencia) throws GestaoEscolarException {
        this.validarFrequencia(frequencia);
        this.verificarAlunoExiste(frequencia.getAluno().getId());
        this.verificarDisciplinaExiste(frequencia.getDisciplina().getId());
        
        return frequenciaRepository.save(frequencia);
    }

    public Frequencia salvarComDTO(FrequenciaDTO frequenciaDTO) throws GestaoEscolarException {
        // Validar se os IDs foram fornecidos
        if (frequenciaDTO.getAlunoId() == null || frequenciaDTO.getAlunoId().trim().isEmpty()) {
            throw new GestaoEscolarException("ID do aluno é obrigatório");
        }
        if (frequenciaDTO.getDisciplinaId() == null || frequenciaDTO.getDisciplinaId().trim().isEmpty()) {
            throw new GestaoEscolarException("ID da disciplina é obrigatório");
        }

        // Verificar se aluno e disciplina existem
        this.verificarAlunoExiste(frequenciaDTO.getAlunoId());
        this.verificarDisciplinaExiste(frequenciaDTO.getDisciplinaId());

        // Buscar as entidades
        Aluno aluno = this.alunoRepository.findById(frequenciaDTO.getAlunoId())
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));
        Disciplina disciplina = this.disciplinaRepository.findById(frequenciaDTO.getDisciplinaId())
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));

        // Criar a entidade Frequencia
        Frequencia frequencia = new Frequencia();
        frequencia.setAluno(aluno);
        frequencia.setDisciplina(disciplina);
        frequencia.setDataAula(frequenciaDTO.getDataAula());
        frequencia.setPresente(frequenciaDTO.getPresente());
        frequencia.setObservacao(frequenciaDTO.getObservacao());

        // Validar a frequencia
        this.validarFrequencia(frequencia);
        
        return frequenciaRepository.save(frequencia);
    }

    public Frequencia atualizar(String id, Frequencia frequencia) throws GestaoEscolarException {
        Frequencia frequenciaEditada = this.buscarPorId(id);

        frequenciaEditada.setPresente(Optional.ofNullable(frequencia.getPresente()).orElse(frequenciaEditada.getPresente()));
        frequenciaEditada.setDataAula(Optional.ofNullable(frequencia.getDataAula()).orElse(frequenciaEditada.getDataAula()));
        frequenciaEditada.setObservacao(Optional.ofNullable(frequencia.getObservacao()).orElse(frequenciaEditada.getObservacao()));

        return this.salvar(frequenciaEditada);
    }

    public void excluir(String id) throws GestaoEscolarException {
        this.buscarPorId(id);
        this.frequenciaRepository.deleteById(id);
    }

    public void excluirPorAlunoEDisciplina(String alunoId, String disciplinaId) throws GestaoEscolarException {
        List<Frequencia> frequencias = this.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
        this.frequenciaRepository.deleteAll(frequencias);
    }

    public void marcarPresencaEmLote(String disciplinaId, LocalDate dataAula, List<String> alunosPresentes) throws GestaoEscolarException {
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));

        for (String alunoId : alunosPresentes) {
            Aluno aluno = this.alunoRepository.findById(alunoId)
                    .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));

            Frequencia frequencia = new Frequencia();
            frequencia.setAluno(aluno);
            frequencia.setDisciplina(disciplina);
            frequencia.setDataAula(dataAula);
            frequencia.setPresente(true);

            this.salvar(frequencia);
        }
    }

    public void marcarFaltaEmLote(String disciplinaId, LocalDate dataAula, List<String> alunosFaltantes) throws GestaoEscolarException {
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));

        for (String alunoId : alunosFaltantes) {
            Aluno aluno = this.alunoRepository.findById(alunoId)
                    .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));

            Frequencia frequencia = new Frequencia();
            frequencia.setAluno(aluno);
            frequencia.setDisciplina(disciplina);
            frequencia.setDataAula(dataAula);
            frequencia.setPresente(false);

            this.salvar(frequencia);
        }
    }

    private void validarFrequencia(Frequencia frequencia) throws GestaoEscolarException {
        if (frequencia.getPresente() == null) {
            throw new GestaoEscolarException("O status de presença não pode ser nulo");
        }
        
        if (frequencia.getDataAula() == null) {
            throw new GestaoEscolarException("A data da aula não pode ser nula");
        }
        
        if (frequencia.getDataAula().isAfter(LocalDate.now())) {
            throw new GestaoEscolarException("A data da aula não pode ser futura");
        }
    }

    private void verificarAlunoExiste(String alunoId) throws GestaoEscolarException {
        if (!this.alunoRepository.existsById(alunoId)) {
            throw new GestaoEscolarException("Aluno não encontrado");
        }
    }

    private void verificarDisciplinaExiste(String disciplinaId) throws GestaoEscolarException {
        if (!this.disciplinaRepository.existsById(disciplinaId)) {
            throw new GestaoEscolarException("Disciplina não encontrada");
        }
    }
}
