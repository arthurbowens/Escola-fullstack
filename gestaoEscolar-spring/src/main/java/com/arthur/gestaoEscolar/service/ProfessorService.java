package com.arthur.gestaoEscolar.service;

import com.arthur.gestaoEscolar.model.entity.Professor;
import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.dto.ProfessorDTO;
import com.arthur.gestaoEscolar.model.repository.ProfessorRepository;
import com.arthur.gestaoEscolar.model.repository.DisciplinaRepository;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Professor buscarProfessorLogado() throws GestaoEscolarException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new GestaoEscolarException("Usuário não autenticado");
        }
        
        String email = authentication.getName();
        return this.professorRepository.findByEmail(email)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado"));
    }

    public Professor buscarPorId(String id) throws GestaoEscolarException {
        return this.professorRepository.findById(id)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado"));
    }

    public List<Professor> buscarTodos() throws GestaoEscolarException {
        List<Professor> professores = this.professorRepository.findAllAtivosOrderByNome();
        if (professores.isEmpty()) {
            throw new GestaoEscolarException("Nenhum professor encontrado");
        }
        return professores;
    }

    public Professor buscarPorCpf(String cpf) throws GestaoEscolarException {
        return this.professorRepository.findByCpf(cpf)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado pelo CPF"));
    }

    public Professor buscarPorDisciplina(String disciplinaId) throws GestaoEscolarException {
        return this.professorRepository.findByDisciplinaId(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Professor não encontrado para esta disciplina"));
    }

    public List<Disciplina> buscarDisciplinasLecionadas(String professorId) throws GestaoEscolarException {
        this.buscarPorId(professorId); // Verifica se o professor existe
        // Usar método mais simples por enquanto
        return this.disciplinaRepository.findByProfessorId(professorId);
    }

    public Professor salvar(Professor professor) throws GestaoEscolarException {
        this.verificarCpfJaUtilizado(professor.getCpf(), professor.getId());
        
        // Criptografar a senha se fornecida
        if (professor.getSenha() != null && !professor.getSenha().trim().isEmpty()) {
            professor.setSenha(passwordEncoder.encode(professor.getSenha()));
        }
        
        return professorRepository.save(professor);
    }

    public Professor salvarComDisciplinas(ProfessorDTO professorDTO) throws GestaoEscolarException {
        // Criar o professor primeiro
        Professor professor = new Professor();
        professor.setNome(professorDTO.getNome());
        professor.setCpf(professorDTO.getCpf());
        professor.setEmail(professorDTO.getEmail());
        professor.setSenha(professorDTO.getSenha());
        professor.setDataNascimento(professorDTO.getDataNascimento());
        professor.setFormacaoAcademica(professorDTO.getFormacaoAcademica());
        professor.setTelefone(professorDTO.getTelefone());
        
        // Verificar CPF
        this.verificarCpfJaUtilizado(professor.getCpf(), null);
        
        // Criptografar a senha se fornecida
        if (professor.getSenha() != null && !professor.getSenha().trim().isEmpty()) {
            professor.setSenha(passwordEncoder.encode(professor.getSenha()));
        }
        
        // Salvar o professor
        Professor professorSalvo = professorRepository.save(professor);
        
        // Associar disciplinas se fornecidas
        if (professorDTO.getDisciplinasIds() != null && !professorDTO.getDisciplinasIds().isEmpty()) {
            for (String disciplinaId : professorDTO.getDisciplinasIds()) {
                try {
                    this.adicionarDisciplina(professorSalvo.getId(), disciplinaId);
                } catch (GestaoEscolarException e) {
                    // Log do erro mas continua o processo
                    System.err.println("Erro ao associar disciplina " + disciplinaId + ": " + e.getMessage());
                }
            }
        }
        
        return professorSalvo;
    }

    public Professor atualizar(String id, Professor professor) throws GestaoEscolarException {
        Professor professorEditado = this.buscarPorId(id);

        professorEditado.setNome(Optional.ofNullable(professor.getNome()).orElse(professorEditado.getNome()));
        professorEditado.setDataNascimento(Optional.ofNullable(professor.getDataNascimento()).orElse(professorEditado.getDataNascimento()));
        professorEditado.setEmail(Optional.ofNullable(professor.getEmail()).orElse(professorEditado.getEmail()));
        professorEditado.setCpf(Optional.ofNullable(professor.getCpf()).orElse(professorEditado.getCpf()));
        professorEditado.setFormacaoAcademica(Optional.ofNullable(professor.getFormacaoAcademica()).orElse(professorEditado.getFormacaoAcademica()));
        professorEditado.setTelefone(Optional.ofNullable(professor.getTelefone()).orElse(professorEditado.getTelefone()));

        return this.salvar(professorEditado);
    }

    public void excluir(String id) throws GestaoEscolarException {
        Professor professor = this.buscarPorId(id);
        
        // Verifica se o professor tem disciplinas associadas
        if (!professor.getDisciplinas().isEmpty()) {
            throw new GestaoEscolarException("Não é possível excluir um professor que possui disciplinas associadas");
        }
        
        this.professorRepository.deleteById(id);
    }

    public void adicionarDisciplina(String professorId, String disciplinaId) throws GestaoEscolarException {
        Professor professor = this.buscarPorId(professorId);
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));
        
        if (professor.getDisciplinas().contains(disciplina)) {
            throw new GestaoEscolarException("Professor já possui esta disciplina");
        }
        
        professor.getDisciplinas().add(disciplina);
        disciplina.setProfessor(professor);
        
        this.professorRepository.save(professor);
        this.disciplinaRepository.save(disciplina);
    }

    public void removerDisciplina(String professorId, String disciplinaId) throws GestaoEscolarException {
        Professor professor = this.buscarPorId(professorId);
        Disciplina disciplina = this.disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new GestaoEscolarException("Disciplina não encontrada"));
        
        if (!professor.getDisciplinas().contains(disciplina)) {
            throw new GestaoEscolarException("Professor não possui esta disciplina");
        }
        
        professor.getDisciplinas().remove(disciplina);
        disciplina.setProfessor(null);
        
        this.professorRepository.save(professor);
        this.disciplinaRepository.save(disciplina);
    }

    public void verificarCpfJaUtilizado(String cpf, String idProfessorAtual) throws GestaoEscolarException {
        boolean cpfJaUtilizado;

        if (idProfessorAtual == null) {
            cpfJaUtilizado = this.professorRepository.existsByCpf(cpf);
        } else {
            cpfJaUtilizado = this.professorRepository.existsByCpfAndIdNot(cpf, idProfessorAtual);
        }

        if (cpfJaUtilizado) {
            throw new GestaoEscolarException("Não pode utilizar um CPF já cadastrado!");
        }
    }
}
