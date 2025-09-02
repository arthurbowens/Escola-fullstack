package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, String>, JpaSpecificationExecutor<Aluno> {

    Optional<Aluno> findByMatricula(String matricula);

    Optional<Aluno> findByEmail(String email);

    boolean existsByMatricula(String matricula);

    boolean existsByMatriculaAndIdNot(String matricula, String id);

    List<Aluno> findByTurmaId(String turmaId);

    @Query("SELECT a FROM Aluno a WHERE a.turma.id = :turmaId ORDER BY a.nome")
    List<Aluno> findByTurmaIdOrderByNome(@Param("turmaId") String turmaId);

    @Query("SELECT a FROM Aluno a WHERE a.ativo = true ORDER BY a.nome")
    List<Aluno> findAllAtivosOrderByNome();
}
