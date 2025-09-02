package com.arthur.gestaoEscolar.controller;

import com.arthur.gestaoEscolar.model.entity.Frequencia;
import com.arthur.gestaoEscolar.service.FrequenciaService;
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
@RequestMapping("/api/frequencias")
@CrossOrigin(origins = "*")
public class FrequenciaController {

    @Autowired
    private FrequenciaService frequenciaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Frequencia>> buscarTodas() {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarTodas();
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Frequencia> buscarPorId(@PathVariable String id) {
        try {
            Frequencia frequencia = frequenciaService.buscarPorId(id);
            return ResponseEntity.ok(frequencia);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Frequencia>> buscarPorAluno(@PathVariable String alunoId) {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarPorAluno(alunoId);
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Frequencia>> buscarPorDisciplina(@PathVariable String disciplinaId) {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarPorDisciplina(disciplinaId);
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Frequencia>> buscarPorAlunoEDisciplina(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/periodo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<List<Frequencia>> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarPorPeriodo(dataInicio, dataFim);
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/periodo")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<List<Frequencia>> buscarPorAlunoEPeriodo(
            @PathVariable String alunoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            List<Frequencia> frequencias = frequenciaService.buscarPorAlunoEPeriodo(alunoId, dataInicio, dataFim);
            return ResponseEntity.ok(frequencias);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}/presencas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<Long> contarPresencas(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            Long presencas = frequenciaService.contarPresencas(alunoId, disciplinaId);
            return ResponseEntity.ok(presencas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}/total-aulas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<Long> contarTotalAulas(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            Long totalAulas = frequenciaService.contarTotalAulas(alunoId, disciplinaId);
            return ResponseEntity.ok(totalAulas);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/aluno/{alunoId}/disciplina/{disciplinaId}/percentual")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR') or #alunoId == authentication.principal.id")
    public ResponseEntity<Double> calcularPercentualPresenca(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            Double percentual = frequenciaService.calcularPercentualPresenca(alunoId, disciplinaId);
            return ResponseEntity.ok(percentual);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Frequencia> salvar(@RequestBody Frequencia frequencia) {
        try {
            Frequencia frequenciaSalva = frequenciaService.salvar(frequencia);
            return ResponseEntity.status(HttpStatus.CREATED).body(frequenciaSalva);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Frequencia> atualizar(@PathVariable String id, @RequestBody Frequencia frequencia) {
        try {
            Frequencia frequenciaAtualizada = frequenciaService.atualizar(id, frequencia);
            return ResponseEntity.ok(frequenciaAtualizada);
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            frequenciaService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/aluno/{alunoId}/disciplina/{disciplinaId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> excluirPorAlunoEDisciplina(@PathVariable String alunoId, @PathVariable String disciplinaId) {
        try {
            frequenciaService.excluirPorAlunoEDisciplina(alunoId, disciplinaId);
            return ResponseEntity.noContent().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/marcar-presenca-lote")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Void> marcarPresencaEmLote(
            @RequestParam String disciplinaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAula,
            @RequestBody List<String> alunosPresentes) {
        try {
            frequenciaService.marcarPresencaEmLote(disciplinaId, dataAula, alunosPresentes);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/marcar-falta-lote")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'PROFESSOR')")
    public ResponseEntity<Void> marcarFaltaEmLote(
            @RequestParam String disciplinaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAula,
            @RequestBody List<String> alunosFaltantes) {
        try {
            frequenciaService.marcarFaltaEmLote(disciplinaId, dataAula, alunosFaltantes);
            return ResponseEntity.ok().build();
        } catch (GestaoEscolarException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
