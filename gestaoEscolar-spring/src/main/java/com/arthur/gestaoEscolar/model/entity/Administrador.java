package com.arthur.gestaoEscolar.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Administrador extends Usuario {

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        this.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
    }
}
