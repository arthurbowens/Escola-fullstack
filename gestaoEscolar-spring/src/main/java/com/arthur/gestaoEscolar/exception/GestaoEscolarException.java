package com.arthur.gestaoEscolar.exception;

public class GestaoEscolarException extends RuntimeException {

    public GestaoEscolarException(String message) {
        super(message);
    }

    public GestaoEscolarException(String message, Throwable cause) {
        super(message, cause);
    }
}
