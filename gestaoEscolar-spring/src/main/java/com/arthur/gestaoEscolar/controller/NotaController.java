package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.entity.Nota;
import com.arthur.gestaoEscolar.model.entity.TipoAvaliacao;
import com.arthur.gestaoEscolar.service.NotaService;
import com.arthur.gestaoEscolar.exception.GestaoEscolarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/notas")
@CrossOrigin(origins = "*")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Nota>> buscarTodas() {
        try {
            List<Nota> notas = notaService.buscarTodas();
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Nota> buscarPorId(@PathVariable String id) {
        try {
            Nota nota = notaService.buscarPorId(id);
            return ResponseEntity.ok(nota);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Nota>> buscarPorAluno(@PathVariable String alunoId) {
        try {
            List<Nota> notas = notaService.buscarPorAluno(alunoId);
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Nota>> buscarPorDisciplina(@PathVariable String disciplinaId) {
        try {
            List<Nota> notas = notaService.buscarPorDisciplina(disciplinaId);
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Nota>> buscarPorAlunoEDisciplina(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            List<Nota> notas = notaService.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}/tipo/{tipoAvaliacao}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Nota>> buscarPorAlunoDisciplinaETipo(@PathVariable String alunoId, @PathVariable String disciplinaId, @PathVariable TipoAvaliacao tipoAvaliacao) {
        try {
            List<Nota> notas = notaService.buscarPorAlunoEDisciplinaETipo(alunoId, disciplinaId, tipoAvaliacao);
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/periodo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Nota>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            List<Nota> notas = notaService.buscarPorPeriodo(dataInicio, dataFim);
            return ResponseEntity.ok(notas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}/media")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<Double> calcularMediaAlunoDisciplina(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            Double media = notaService.calcularMediaAlunoDisciplina(alunoId, disciplinaId);
            return ResponseEntity.ok(media);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Nota> salvar(@RequestBody Nota nota) {
        try {
            Nota notaSalva = notaService.salvar(nota);
            return ResponseEntity.status(HttpStatus.CREATED).body(notaSalva);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Nota> atualizar(@PathVariable String id, @RequestBody Nota nota) {
        try {
            Nota notaAtualizada = notaService.atualizar(id, nota);
            return ResponseEntity.ok(notaAtualizada);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            notaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluirPorAlunoEDisciplina(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            notaService.excluirPorAlunoEDisciplina(alunoId, disciplinaId);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
