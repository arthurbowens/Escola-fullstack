package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Nota;
import com.arthur.gestaoEscolar.model.entity.Aluno;
import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.entity.TipoAvaliacao;
import com.arthur.gestaoEscolar.model.repository.NotaRepository;
import com.arthur.gestaoEscolar.model.repository.AlunoRepository;
import com.arthur.gestaoEscolar.model.repository.DisciplinaRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Nota buscarPorId(String id) throws GestaoEscolarException {
        return this.notaRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Nota não encontrada"));
    }

    public List<Nota> buscarTodas() throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findAll();
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada");
        }
        return notas;
    }

    public List<Nota> buscarPorAluno(String alunoId) throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findByAlunoId(alunoId);
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada para este aluno");
        }
        return notas;
    }

    public List<Nota> buscarPorDisciplina(String disciplinaId) throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findByDisciplinaId(disciplinaId);
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada para esta disciplina");
        }
        return notas;
    }

    public List<Nota> buscarPorAlunoEDisciplina(String alunoId, String disciplinaId) throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findByAlunoAndDisciplinaOrderByData(alunoId, disciplinaId);
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada para este aluno nesta disciplina");
        }
        return notas;
    }

    public List<Nota> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findByPeriodo(dataInicio, dataFim);
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada para o período especificado");
        }
        return notas;
    }

    public List<Nota> buscarPorAlunoEDisciplinaETipo(String alunoId, String disciplinaId, TipoAvaliacao tipoAvaliacao) throws GestaoEscolarException {
        List<Nota> notas = this.notaRepository.findByAlunoDisciplinaAndTipo(alunoId, disciplinaId, tipoAvaliacao.name());
        if (notas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma nota encontrada para os critérios especificados");
        }
        return notas;
    }

    public Double calcularMediaAlunoDisciplina(String alunoId, String disciplinaId) throws GestaoEscolarException {
        Optional<Double> media = this.notaRepository.calcularMediaAlunoDisciplina(alunoId, disciplinaId);
        return media.orElse(0.0);
    }

    public Nota salvar(Nota nota) throws GestaoEscolarException {
        this.validarNota(nota);
        this.verificarAlunoExiste(nota.getAluno().getId());
        this.verificarDisciplinaExiste(nota.getDisciplina().getId());
        
        return notaRepository.save(nota);
    }

    public Nota atualizar(String id, Nota nota) throws GestaoEscolarException {
        Nota notaEditada = this.buscarPorId(id);

        notaEditada.setValor(Optional.ofNullable(nota.getValor()).orElse(notaEditada.getValor()));
        notaEditada.setTipoAvaliacao(Optional.ofNullable(nota.getTipoAvaliacao()).orElse(notaEditada.getTipoAvaliacao()));
        notaEditada.setDataAvaliacao(Optional.ofNullable(nota.getDataAvaliacao()).orElse(notaEditada.getDataAvaliacao()));
        notaEditada.setObservacao(Optional.ofNullable(nota.getObservacao()).orElse(notaEditada.getObservacao()));

        return this.salvar(notaEditada);
    }

    public void excluir(String id) throws GestaoEscolarException {
        this.buscarPorId(id);
        this.notaRepository.deleteById(id);
    }

    public void excluirPorAlunoEDisciplina(String alunoId, String disciplinaId) throws GestaoEscolarException {
        List<Nota> notas = this.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
        this.notaRepository.deleteAll(notas);
    }

    private void validarNota(Nota nota) throws GestaoEscolarException {
        if (nota.getValor() == null) {
            throw new GestaoEscolarException("O valor da nota não pode ser nulo");
        }
        
        if (nota.getValor() < 0.0 || nota.getValor() > 10.0) {
            throw new GestaoEscolarException("A nota deve estar entre 0.0 e 10.0");
        }
        
        if (nota.getTipoAvaliacao() == null) {
            throw new GestaoEscolarException("O tipo de avaliação não pode ser nulo");
        }
        
        if (nota.getDataAvaliacao() == null) {
            throw new GestaoEscolarException("A data da avaliação não pode ser nula");
        }
        
        if (nota.getDataAvaliacao().isAfter(LocalDate.now())) {
            throw new GestaoEscolarException("A data da avaliação não pode ser futura");
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
