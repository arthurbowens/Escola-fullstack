package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.model.dto.DisciplinaDTO;
import com.arthur.gestaoEscolar.service.DisciplinaService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<List<DisciplinaDTO>> buscarTodas() {
        try {
            List<Disciplina> disciplinas = disciplinaService.buscarTodas();
            List<DisciplinaDTO> disciplinasDTO = disciplinas.stream()
                    .map(DisciplinaDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(disciplinasDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<DisciplinaDTO> buscarPorId(@PathVariable String id) {
        try {
            Disciplina disciplina = disciplinaService.buscarPorId(id);
            return ResponseEntity.ok(new DisciplinaDTO(disciplina));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/nome/{nome}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR', 'ALUNO')")
    public ResponseEntity<Disciplina> buscarPorNome(@PathVariable String nome) {
        try {
            Disciplina disciplina = disciplinaService.buscarPorNome(nome);
            return ResponseEntity.ok(disciplina);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/professor/{professorId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Disciplina>> buscarPorProfessor(@PathVariable String professorId) {
        try {
            List<Disciplina> disciplinas = disciplinaService.buscarPorProfessor(professorId);
            return ResponseEntity.ok(disciplinas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Disciplina>> buscarPorAluno(@PathVariable String alunoId) {
        try {
            List<Disciplina> disciplinas = disciplinaService.buscarPorAluno(alunoId);
            return ResponseEntity.ok(disciplinas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Disciplina> salvar(@RequestBody Disciplina disciplina) {
        try {
            Disciplina disciplinaSalva = disciplinaService.salvar(disciplina);
            return ResponseEntity.status(HttpStatus.CREATED).body(disciplinaSalva);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Disciplina> atualizar(@PathVariable String id, @RequestBody Disciplina disciplina) {
        try {
            Disciplina disciplinaAtualizada = disciplinaService.atualizar(id, disciplina);
            return ResponseEntity.ok(disciplinaAtualizada);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            disciplinaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PatchMapping("/{id}/alterar-professor")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> alterarProfessor(@PathVariable String id, @RequestParam String novoProfessorId) {
        try {
            disciplinaService.alterarProfessor(id, novoProfessorId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
