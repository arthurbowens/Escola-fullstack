package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FrequenciaRepository extends JpaRepository<Frequencia, String>, JpaSpecificationExecutor<Frequencia> {

    List<Frequencia> findByAlunoId(String alunoId);

    List<Frequencia> findByDisciplinaId(String disciplinaId);

    List<Frequencia> findByAlunoIdAndDisciplinaId(String alunoId, String disciplinaId);

    @Query("SELECT f FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.disciplina.id = :disciplinaId ORDER BY f.dataAula DESC")
    List<Frequencia> findByAlunoAndDisciplinaOrderByData(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.disciplina.id = :disciplinaId AND f.presente = true")
    Long countPresencasByAlunoAndDisciplina(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.disciplina.id = :disciplinaId")
    Long countTotalAulasByAlunoAndDisciplina(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT (COUNT(f) * 100.0 / (SELECT COUNT(f2) FROM Frequencia f2 WHERE f2.aluno.id = :alunoId AND f2.disciplina.id = :disciplinaId)) " +
           "FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.disciplina.id = :disciplinaId AND f.presente = true")
    Optional<Double> calcularPercentualPresenca(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT f FROM Frequencia f WHERE f.dataAula BETWEEN :dataInicio AND :dataFim")
    List<Frequencia> findByPeriodo(@Param("dataInicio") LocalDate dataInicio, @Param("dataFim") LocalDate dataFim);

    @Query("SELECT f FROM Frequencia f WHERE f.aluno.id = :alunoId AND f.dataAula BETWEEN :dataInicio AND :dataFim")
    List<Frequencia> findByAlunoAndPeriodo(@Param("alunoId") String alunoId, @Param("dataInicio") LocalDate dataInicio, @Param("dataFim") LocalDate dataFim);
}
