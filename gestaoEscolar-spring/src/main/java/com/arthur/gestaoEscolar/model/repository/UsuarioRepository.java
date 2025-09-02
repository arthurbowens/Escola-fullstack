package com.arthur.gestaoEscolar.model.repository;

import com.arthur.gestaoEscolar.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String>, JpaSpecificationExecutor<Usuario> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, String id);

    List<Usuario> findByTipoUsuario(com.arthur.gestaoEscolar.model.entity.TipoUsuario tipoUsuario);
}
