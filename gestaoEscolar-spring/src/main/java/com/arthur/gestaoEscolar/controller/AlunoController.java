package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.dto.AlunoDTO;
import com.arthur.gestaoEscolar.model.entity.Aluno;
import com.arthur.gestaoEscolar.service.AlunoService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<AlunoDTO>> buscarTodos() {
        try {
            List<Aluno> alunos = alunoService.buscarTodos();
            List<AlunoDTO> alunosDTO = alunos.stream()
                    .map(AlunoDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(alunosDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #id == authentication.principal.id")
    public ResponseEntity<AlunoDTO> buscarPorId(@PathVariable String id) {
        try {
            Aluno aluno = alunoService.buscarPorId(id);
            return ResponseEntity.ok(new AlunoDTO(aluno));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<AlunoDTO> buscarMeusDados() {
        try {
            Aluno aluno = alunoService.buscarPorEmail(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
            return ResponseEntity.ok(new AlunoDTO(aluno));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/matricula/{matricula}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<AlunoDTO> buscarPorMatricula(@PathVariable String matricula) {
        try {
            Aluno aluno = alunoService.buscarPorMatricula(matricula);
            return ResponseEntity.ok(new AlunoDTO(aluno));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/turma/{turmaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<AlunoDTO>> buscarPorTurma(@PathVariable String turmaId) {
        try {
            List<Aluno> alunos = alunoService.buscarPorTurma(turmaId);
            List<AlunoDTO> alunosDTO = alunos.stream()
                    .map(AlunoDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(alunosDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AlunoDTO> salvar(@RequestBody Aluno aluno) {
        try {
            Aluno alunoSalvo = alunoService.salvar(aluno);
            return ResponseEntity.status(HttpStatus.CREATED).body(new AlunoDTO(alunoSalvo));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<AlunoDTO> atualizar(@PathVariable String id, @RequestBody Aluno aluno) {
        try {
            Aluno alunoAtualizado = alunoService.atualizar(id, aluno);
            return ResponseEntity.ok(new AlunoDTO(alunoAtualizado));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            alunoService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/transferir-turma")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> transferirTurma(@PathVariable String id, @RequestParam String novaTurmaId) {
        try {
            alunoService.transferirTurma(id, novaTurmaId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
