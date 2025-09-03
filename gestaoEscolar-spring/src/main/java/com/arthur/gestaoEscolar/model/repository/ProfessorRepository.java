package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, String>, JpaSpecificationExecutor<Professor> {

    Optional<Professor> findByCpf(String cpf);

    Optional<Professor> findByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, String id);

    @Query("SELECT p FROM Professor p WHERE p.ativo = true ORDER BY p.nome")
    List<Professor> findAllAtivosOrderByNome();

    @Query("SELECT p FROM Professor p JOIN p.disciplinas d WHERE d.id = :disciplinaId")
    Optional<Professor> findByDisciplinaId(@Param("disciplinaId") String disciplinaId);
}
