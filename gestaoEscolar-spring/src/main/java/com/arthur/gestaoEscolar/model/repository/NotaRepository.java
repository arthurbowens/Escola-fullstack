package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, String>, JpaSpecificationExecutor<Nota> {

    List<Nota> findByAlunoId(String alunoId);

    List<Nota> findByDisciplinaId(String disciplinaId);

    List<Nota> findByAlunoIdAndDisciplinaId(String alunoId, String disciplinaId);

    @Query("SELECT n FROM Nota n WHERE n.aluno.id = :alunoId AND n.disciplina.id = :disciplinaId ORDER BY n.dataAvaliacao DESC")
    List<Nota> findByAlunoAndDisciplinaOrderByData(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.aluno.id = :alunoId AND n.disciplina.id = :disciplinaId")
    Optional<Double> calcularMediaAlunoDisciplina(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId);

    @Query("SELECT n FROM Nota n WHERE n.aluno.id = :alunoId AND n.disciplina.id = :disciplinaId AND n.tipoAvaliacao = :tipoAvaliacao")
    List<Nota> findByAlunoDisciplinaAndTipo(@Param("alunoId") String alunoId, @Param("disciplinaId") String disciplinaId, @Param("tipoAvaliacao") String tipoAvaliacao);

    @Query("SELECT n FROM Nota n WHERE n.dataAvaliacao BETWEEN :dataInicio AND :dataFim")
    List<Nota> findByPeriodo(@Param("dataInicio") LocalDate dataInicio, @Param("dataFim") LocalDate dataFim);
}
