package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, String>, JpaSpecificationExecutor<Disciplina> {

    Optional<Disciplina> findByNome(String nome);

    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, String id);

    List<Disciplina> findByProfessorId(String professorId);

    @Query("SELECT d FROM Disciplina d WHERE d.professor.id = :professorId ORDER BY d.nome")
    List<Disciplina> findByProfessorIdOrderByNome(@Param("professorId") String professorId);

    @Query("SELECT d FROM Disciplina d JOIN d.notas n WHERE n.aluno.id = :alunoId")
    List<Disciplina> findByAlunoId(@Param("alunoId") String alunoId);

    // Query complexa comentada temporariamente para resolver problema de inicialização
    // @Query("SELECT DISTINCT d FROM Disciplina d JOIN Turma t JOIN t.disciplinas td WHERE d.id = td.id AND d.professor.id = :professorId")
    // List<Disciplina> findDisciplinasLecionadasPorProfessor(@Param("professorId") String professorId);
}
