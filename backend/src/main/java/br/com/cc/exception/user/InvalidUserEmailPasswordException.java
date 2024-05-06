package br.com.cc.exception.user;

public class InvalidUserEmailPasswordException extends RuntimeException {

    public InvalidUserEmailPasswordException() {
        super("E-mail e/ou senha incorreta.");
    }

    public InvalidUserEmailPasswordException(String message) {
        super(message);
    }
}