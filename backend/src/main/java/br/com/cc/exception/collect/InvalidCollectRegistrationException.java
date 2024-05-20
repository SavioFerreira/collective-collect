package br.com.cc.exception.collect;

public class InvalidCollectRegistrationException extends RuntimeException {

    public InvalidCollectRegistrationException() {
        super("Não foi realizar o cadastro!");
    }

    public InvalidCollectRegistrationException(String message) {
        super(message);
    }
}