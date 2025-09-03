package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.entity.Professor;
import com.arthur.gestaoEscolar.model.repository.DisciplinaRepository;
import com.arthur.gestaoEscolar.model.repository.ProfessorRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    public Disciplina buscarPorId(String id) throws GestaoEscolarException {
        return this.disciplinaRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));
    }

    public List<Disciplina> buscarTodas() throws GestaoEscolarException {
        List<Disciplina> disciplinas = this.disciplinaRepository.findAll();
        if (disciplinas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma disciplina encontrada");
        }
        return disciplinas;
    }

    public Disciplina buscarPorNome(String nome) throws GestaoEscolarException {
        return this.disciplinaRepository.findByNome(nome)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada pelo nome"));
    }

    public List<Disciplina> buscarPorProfessor(String professorId) throws GestaoEscolarException {
        List<Disciplina> disciplinas = this.disciplinaRepository.findByProfessorIdOrderByNome(professorId);
        if (disciplinas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma disciplina encontrada para este professor");
        }
        return disciplinas;
    }

    public List<Disciplina> buscarPorAluno(String alunoId) throws GestaoEscolarException {
        List<Disciplina> disciplinas = this.disciplinaRepository.findByAlunoId(alunoId);
        if (disciplinas.isEmpty()) {
            throw new GestaoEscolarException("Nenhuma disciplina encontrada para este aluno");
        }
        return disciplinas;
    }

    public Disciplina salvar(Disciplina disciplina) throws GestaoEscolarException {
        this.verificarNomeJaUtilizado(disciplina.getNome(), disciplina.getId());
        
        // Verifica se o professor foi informado antes de validar
        if (disciplina.getProfessor() != null) {
            this.verificarProfessorExiste(disciplina.getProfessor().getId());
        }
        
        return disciplinaRepository.save(disciplina);
    }

    public Disciplina atualizar(String id, Disciplina disciplina) throws GestaoEscolarException {
        Disciplina disciplinaEditada = this.buscarPorId(id);

        disciplinaEditada.setNome(Optional.ofNullable(disciplina.getNome()).orElse(disciplinaEditada.getNome()));
        disciplinaEditada.setCargaHoraria(Optional.ofNullable(disciplina.getCargaHoraria()).orElse(disciplinaEditada.getCargaHoraria()));
        
        if (disciplina.getProfessor() != null) {
            this.verificarProfessorExiste(disciplina.getProfessor().getId());
            disciplinaEditada.setProfessor(disciplina.getProfessor());
        }

        return this.salvar(disciplinaEditada);
    }

    public void excluir(String id) throws GestaoEscolarException {
        Disciplina disciplina = this.buscarPorId(id);
        
        // Verifica se a disciplina tem notas ou frequências
        if (!disciplina.getNotas().isEmpty() || !disciplina.getFrequencias().isEmpty()) {
            throw new GestaoEscolarException("Não é possível excluir uma disciplina que possui notas ou frequências registradas");
        }
        
        this.disciplinaRepository.deleteById(id);
    }

    public void alterarProfessor(String disciplinaId, String novoProfessorId) throws GestaoEscolarException {
        Disciplina disciplina = this.buscarPorId(disciplinaId);
        Professor novoProfessor = this.professorRepository.findById(novoProfessorId)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado"));
        
        // Remove a disciplina do professor anterior
        if (disciplina.getProfessor() != null) {
            disciplina.getProfessor().getDisciplinas().remove(disciplina);
            this.professorRepository.save(disciplina.getProfessor());
        }
        
        // Adiciona a disciplina ao novo professor
        disciplina.setProfessor(novoProfessor);
        novoProfessor.getDisciplinas().add(disciplina);
        
        this.disciplinaRepository.save(disciplina);
        this.professorRepository.save(novoProfessor);
    }

    public void verificarNomeJaUtilizado(String nome, String idDisciplinaAtual) throws GestaoEscolarException {
        boolean nomeJaUtilizado;

        if (idDisciplinaAtual == null) {
            nomeJaUtilizado = this.disciplinaRepository.existsByNome(nome);
        } else {
            nomeJaUtilizado = this.disciplinaRepository.existsByNomeAndIdNot(nome, idDisciplinaAtual);
        }

        if (nomeJaUtilizado) {
            throw new GestaoEscolarException("Não pode utilizar um nome de disciplina já cadastrado!");
        }
    }

    private void verificarProfessorExiste(String professorId) throws GestaoEscolarException {
        if (!this.professorRepository.existsById(professorId)) {
            throw new GestaoEscolarException("Professor não encontrado");
        }
    }

    public Professor buscarProfessorPorId(String professorId) throws GestaoEscolarException {
        return this.professorRepository.findById(professorId)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado"));
    }
}
