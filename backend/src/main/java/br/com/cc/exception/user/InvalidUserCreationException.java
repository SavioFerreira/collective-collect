package br.com.cc.exception.user;

public class InvalidUserCreationException extends RuntimeException {

    public InvalidUserCreationException() {
        super("Não foi possível criar esse Usuário!");
    }

    public InvalidUserCreationException(String message) {
        super(message);
    }
}