package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.dto.ProfessorDTO;
import com.arthur.gestaoEscolar.model.entity.Professor;
import com.arthur.gestaoEscolar.model.entity.Disciplina;
import com.arthur.gestaoEscolar.service.ProfessorService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<ProfessorDTO>> buscarTodos() {
        try {
            List<Professor> professores = professorService.buscarTodos();
            List<ProfessorDTO> professoresDTO = professores.stream()
                    .map(ProfessorDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(professoresDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #id == authentication.principal.id")
    public ResponseEntity<ProfessorDTO> buscarPorId(@PathVariable String id) {
        try {
            Professor professor = professorService.buscarPorId(id);
            return ResponseEntity.ok(new ProfessorDTO(professor));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/cpf/{cpf}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProfessorDTO> buscarPorCpf(@PathVariable String cpf) {
        try {
            Professor professor = professorService.buscarPorCpf(cpf);
            return ResponseEntity.ok(new ProfessorDTO(professor));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<ProfessorDTO> buscarPorDisciplina(@PathVariable String disciplinaId) {
        try {
            Professor professor = professorService.buscarPorDisciplina(disciplinaId);
            return ResponseEntity.ok(new ProfessorDTO(professor));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}/disciplinas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #id == authentication.principal.id")
    public ResponseEntity<List<Disciplina>> buscarDisciplinasLecionadas(@PathVariable String id) {
        try {
            List<Disciplina> disciplinas = professorService.buscarDisciplinasLecionadas(id);
            return ResponseEntity.ok(disciplinas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProfessorDTO> salvar(@RequestBody ProfessorDTO professorDTO) {
        try {
            Professor professorSalvo = professorService.salvarComDisciplinas(professorDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProfessorDTO(professorSalvo));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<ProfessorDTO> atualizar(@PathVariable String id, @RequestBody Professor professor) {
        try {
            Professor professorAtualizado = professorService.atualizar(id, professor);
            return ResponseEntity.ok(new ProfessorDTO(professorAtualizado));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            professorService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{id}/disciplinas/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> adicionarDisciplina(@PathVariable String id, @PathVariable String disciplinaId) {
        try {
            professorService.adicionarDisciplina(id, disciplinaId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}/disciplinas/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> removerDisciplina(@PathVariable String id, @PathVariable String disciplinaId) {
        try {
            professorService.removerDisciplina(id, disciplinaId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
