package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.dto.TurmaDTO;
import com.arthur.gestaoEscolar.model.entity.Turma;
import com.arthur.gestaoEscolar.service.TurmaService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/turmas")
@CrossOrigin(origins = "*")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<TurmaDTO>> buscarTodas() {
        try {
            List<Turma> turmas = turmaService.buscarTodas();
            List<TurmaDTO> turmasDTO = turmas.stream()
                    .map(TurmaDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(turmasDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<TurmaDTO> buscarPorId(@PathVariable String id) {
        try {
            Turma turma = turmaService.buscarPorId(id);
            return ResponseEntity.ok(new TurmaDTO(turma));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/nome/{nome}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<TurmaDTO> buscarPorNome(@PathVariable String nome) {
        try {
            Turma turma = turmaService.buscarPorNome(nome);
            return ResponseEntity.ok(new TurmaDTO(turma));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/ano-letivo/{anoLetivo}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<TurmaDTO>> buscarPorAnoLetivo(@PathVariable Integer anoLetivo) {
        try {
            List<Turma> turmas = turmaService.buscarPorAnoLetivo(anoLetivo);
            List<TurmaDTO> turmasDTO = turmas.stream()
                    .map(TurmaDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(turmasDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<TurmaDTO> buscarPorAluno(@PathVariable String alunoId) {
        try {
            Turma turma = turmaService.buscarPorAluno(alunoId);
            return ResponseEntity.ok(new TurmaDTO(turma));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<TurmaDTO>> buscarPorDisciplina(@PathVariable String disciplinaId) {
        try {
            List<Turma> turmas = turmaService.buscarPorDisciplina(disciplinaId);
            List<TurmaDTO> turmasDTO = turmas.stream()
                    .map(TurmaDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(turmasDTO);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurmaDTO> salvar(@RequestBody Turma turma) {
        try {
            Turma turmaSalva = turmaService.salvar(turma);
            return ResponseEntity.status(HttpStatus.CREATED).body(new TurmaDTO(turmaSalva));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurmaDTO> atualizar(@PathVariable String id, @RequestBody Turma turma) {
        try {
            Turma turmaAtualizada = turmaService.atualizar(id, turma);
            return ResponseEntity.ok(new TurmaDTO(turmaAtualizada));
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            turmaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{id}/alunos/{alunoId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> adicionarAluno(@PathVariable String id, @PathVariable String alunoId) {
        try {
            turmaService.adicionarAluno(id, alunoId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}/alunos/{alunoId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> removerAluno(@PathVariable String id, @PathVariable String alunoId) {
        try {
            turmaService.removerAluno(id, alunoId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{id}/disciplinas/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> adicionarDisciplina(@PathVariable String id, @PathVariable String disciplinaId) {
        try {
            turmaService.adicionarDisciplina(id, disciplinaId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}/disciplinas/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> removerDisciplina(@PathVariable String id, @PathVariable String disciplinaId) {
        try {
            turmaService.removerDisciplina(id, disciplinaId);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
