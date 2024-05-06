package br.com.cc.exception.user;

public class InvalidUserEmailException extends RuntimeException {

    public InvalidUserEmailException() {
        super("Este email já está cadastrado!");
    }

    public InvalidUserEmailException(String message) {
        super(message);
    }
}