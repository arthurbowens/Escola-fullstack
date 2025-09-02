package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Aluno;
import com.arthur.gestaoEscolar.model.entity.Turma;
import com.arthur.gestaoEscolar.model.repository.AlunoRepository;
import com.arthur.gestaoEscolar.model.repository.TurmaRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Aluno buscarPorId(String id) throws GestaoEscolarException {
        return this.alunoRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado"));
    }

    public List<Aluno> buscarTodos() throws GestaoEscolarException {
        List<Aluno> alunos = this.alunoRepository.findAllAtivosOrderByNome();
        if (alunos.isEmpty()) {
            throw new GestaoEscolarException("Nenhum aluno encontrado");
        }
        return alunos;
    }

    public Aluno buscarPorMatricula(String matricula) throws GestaoEscolarException {
        return this.alunoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado pela matrícula"));
    }

    public Aluno buscarPorEmail(String email) throws GestaoEscolarException {
        return this.alunoRepository.findByEmail(email)
                .orElseThrow(() -> new GestaoEscolarException("Aluno não encontrado pelo email"));
    }

    public List<Aluno> buscarPorTurma(String turmaId) throws GestaoEscolarException {
        List<Aluno> alunos = this.alunoRepository.findByTurmaIdOrderByNome(turmaId);
        if (alunos.isEmpty()) {
            throw new GestaoEscolarException("Nenhum aluno encontrado para esta turma");
        }
        return alunos;
    }

    public Aluno salvar(Aluno aluno) throws GestaoEscolarException {
        this.verificarMatriculaJaUtilizada(aluno.getMatricula(), aluno.getId());
        
        // Verificar se a turma foi informada antes de validar
        if (aluno.getTurma() != null && aluno.getTurma().getId() != null) {
            this.verificarTurmaExiste(aluno.getTurma().getId());
        } else {
            throw new GestaoEscolarException("Turma é obrigatória para cadastrar um aluno");
        }
        
        // Criptografar a senha se fornecida
        if (aluno.getSenha() != null && !aluno.getSenha().trim().isEmpty()) {
            aluno.setSenha(passwordEncoder.encode(aluno.getSenha()));
        }
        
        return alunoRepository.save(aluno);
    }

    public Aluno atualizar(String id, Aluno aluno) throws GestaoEscolarException {
        Aluno alunoEditado = this.buscarPorId(id);

        alunoEditado.setNome(Optional.ofNullable(aluno.getNome()).orElse(alunoEditado.getNome()));
        alunoEditado.setDataNascimento(Optional.ofNullable(aluno.getDataNascimento()).orElse(alunoEditado.getDataNascimento()));
        alunoEditado.setEmail(Optional.ofNullable(aluno.getEmail()).orElse(alunoEditado.getEmail()));
        alunoEditado.setMatricula(Optional.ofNullable(aluno.getMatricula()).orElse(alunoEditado.getMatricula()));
        
        if (aluno.getTurma() != null) {
            this.verificarTurmaExiste(aluno.getTurma().getId());
            alunoEditado.setTurma(aluno.getTurma());
        }

        return this.salvar(alunoEditado);
    }

    public void excluir(String id) throws GestaoEscolarException {
        this.buscarPorId(id);
        this.alunoRepository.deleteById(id);
    }

    public void transferirTurma(String alunoId, String novaTurmaId) throws GestaoEscolarException {
        Aluno aluno = this.buscarPorId(alunoId);
        Turma novaTurma = this.turmaRepository.findById(novaTurmaId)
                .orElseThrow(() -> new GestaoEscolarException("Turma não encontrada"));
        
        aluno.setTurma(novaTurma);
        this.alunoRepository.save(aluno);
    }

    public void verificarMatriculaJaUtilizada(String matricula, String idAlunoAtual) throws GestaoEscolarException {
        boolean matriculaJaUtilizada;

        if (idAlunoAtual == null) {
            matriculaJaUtilizada = this.alunoRepository.existsByMatricula(matricula);
        } else {
            matriculaJaUtilizada = this.alunoRepository.existsByMatriculaAndIdNot(matricula, idAlunoAtual);
        }

        if (matriculaJaUtilizada) {
            throw new GestaoEscolarException("Não pode utilizar uma matrícula já cadastrada!");
        }
    }

    private void verificarTurmaExiste(String turmaId) throws GestaoEscolarException {
        if (!this.turmaRepository.existsById(turmaId)) {
            throw new GestaoEscolarException("Turma não encontrada");
        }
    }
}
