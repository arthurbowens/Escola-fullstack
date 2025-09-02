package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Turma;
import com.arthur.gestaoEscolar.model.entity.Aluno;
import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.repository.TurmaRepository;
import com.arthur.gestaoEscolar.model.repository.AlunoRepository;
import com.arthur.gestaoEscolar.model.repository.DisciplinaRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Turma buscarPorId(String id) throws GestaoEscolarException {
        return this.turmaRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Turma não encontrada"));
    }

    public List<Turma> buscarTodas() throws GestaoEscolarException {
        List<Turma> turmas = this.turmaRepository.findAll();
        if (turmas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma turma encontrada");
        }
        return turmas;
    }

    public Turma buscarPorNome(String nome) throws GestaoEscolarException {
        return this.turmaRepository.findByNome(nome)
                .orElseThrow(() -> new GestaoEscolarException("Turma não encontrada pelo nome"));
    }

    public List<Turma> buscarPorAnoLetivo(Integer anoLetivo) throws GestaoEscolarException {
        List<Turma> turmas = this.turmaRepository.findByAnoLetivoOrderByNome(anoLetivo);
        if (turmas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma turma encontrada para o ano letivo " + anoLetivo);
        }
        return turmas;
    }

    public Turma buscarPorAluno(String alunoId) throws GestaoEscolarException {
        return this.turmaRepository.findByAlunoId(alunoId)
                .orElseThrow(() -> new GestaoEscolarException("Turma não encontrada para este aluno"));
    }

    public List<Turma> buscarPorDisciplina(String disciplinaId) throws GestaoEscolarException {
        List<Turma> turmas = this.turmaRepository.findByDisciplinaId(disciplinaId);
        if (turmas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma turma encontrada para esta disciplina");
        }
        return turmas;
    }

    public Turma salvar(Turma turma) throws GestaoEscolarException {
        this.verificarNomeJaUtilizado(turma.getNome(), turma.getId());
        
        return turmaRepository.save(turma);
    }

    public Turma atualizar(String id, Turma turma) throws GestaoEscolarException {
        Turma turmaEditada = this.buscarPorId(id);

        turmaEditada.setNome(Optional.ofNullable(turma.getNome()).orElse(turmaEditada.getNome()));
        turmaEditada.setAnoLetivo(Optional.ofNullable(turma.getAnoLetivo()).orElse(turmaEditada.getAnoLetivo()));

        return this.salvar(turmaEditada);
    }

    public void excluir(String id) throws GestaoEscolarException {
        Turma turma = this.buscarPorId(id);
        
        // Verifica se a turma tem alunos
        if (!turma.getAlunos().isEmpty()) {
            throw new GestaoEscolarException("Não é possível excluir uma turma que possui alunos");
        }
        
        this.turmaRepository.deleteById(id);
    }

    public void adicionarAluno(String turmaId, String alunoId) throws GestaoEscolarException {
        Turma turma = this.buscarPorId(turmaId);
        Aluno aluno = this.alunoRepository.findById(alunoId)
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));
        
        if (turma.getAlunos().contains(aluno)) {
            throw new GestaoEscolarException("Aluno já está nesta turma");
        }
        
        // Remove o aluno da turma anterior se existir
        if (aluno.getTurma() != null) {
            aluno.getTurma().getAlunos().remove(aluno);
        }
        
        turma.getAlunos().add(aluno);
        aluno.setTurma(turma);
        
        this.turmaRepository.save(turma);
        this.alunoRepository.save(aluno);
    }

    public void removerAluno(String turmaId, String alunoId) throws GestaoEscolarException {
        Turma turma = this.buscarPorId(turmaId);
        Aluno aluno = this.alunoRepository.findById(alunoId)
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));
        
        if (!turma.getAlunos().contains(aluno)) {
            throw new GestaoEscolarException("Aluno não está nesta turma");
        }
        
        turma.getAlunos().remove(aluno);
        aluno.setTurma(null);
        
        this.turmaRepository.save(turma);
        this.alunoRepository.save(aluno);
    }

    public void adicionarDisciplina(String turmaId, String disciplinaId) throws GestaoEscolarException {
        Turma turma = this.buscarPorId(turmaId);
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));
        
        if (turma.getDisciplinas().contains(disciplina)) {
            throw new GestaoEscolarException("Disciplina já está nesta turma");
        }
        
        turma.getDisciplinas().add(disciplina);
        this.turmaRepository.save(turma);
    }

    public void removerDisciplina(String turmaId, String disciplinaId) throws GestaoEscolarException {
        Turma turma = this.buscarPorId(turmaId);
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));
        
        if (!turma.getDisciplinas().contains(disciplina)) {
            throw new GestaoEscolarException("Disciplina não está nesta turma");
        }
        
        turma.getDisciplinas().remove(disciplina);
        this.turmaRepository.save(turma);
    }

    public void verificarNomeJaUtilizado(String nome, String idTurmaAtual) throws GestaoEscolarException {
        boolean nomeJaUtilizado;

        if (idTurmaAtual == null) {
            nomeJaUtilizado = this.turmaRepository.existsByNome(nome);
        } else {
            nomeJaUtilizado = this.turmaRepository.existsByNomeAndIdNot(nome, idTurmaAtual);
        }

        if (nomeJaUtilizado) {
            throw new GestaoEscolarException("Não pode utilizar um nome de turma já cadastrado!");
        }
    }
}
