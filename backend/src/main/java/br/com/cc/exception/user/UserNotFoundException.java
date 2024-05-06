package br.com.cc.exception.user;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException() {
        super("Esse Usuário não foi encontrado!");
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}