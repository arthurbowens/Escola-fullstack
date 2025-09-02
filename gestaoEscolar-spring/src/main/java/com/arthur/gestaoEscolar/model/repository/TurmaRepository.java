package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, String>, JpaSpecificationExecutor<Turma> {

    Optional<Turma> findByNome(String nome);

    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, String id);

    List<Turma> findByAnoLetivo(Integer anoLetivo);

    @Query("SELECT t FROM Turma t WHERE t.anoLetivo = :anoLetivo ORDER BY t.nome")
    List<Turma> findByAnoLetivoOrderByNome(@Param("anoLetivo") Integer anoLetivo);

    @Query("SELECT t FROM Turma t JOIN t.alunos a WHERE a.id = :alunoId")
    Optional<Turma> findByAlunoId(@Param("alunoId") String alunoId);

    @Query("SELECT t FROM Turma t JOIN t.disciplinas d WHERE d.id = :disciplinaId")
    List<Turma> findByDisciplinaId(@Param("disciplinaId") String disciplinaId);
}
