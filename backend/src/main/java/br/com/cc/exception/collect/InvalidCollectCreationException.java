package br.com.cc.exception.collect;

public class InvalidCollectCreationException extends RuntimeException {

    public InvalidCollectCreationException() {
        super("Não foi possível criar essa coleta!");
    }

    public InvalidCollectCreationException(String message) {
        super(message);
    }
}