package br.com.cc.exception;

public class InvalidCollectCreationException extends RuntimeException {

    public InvalidCollectCreationException(String message) {
        super(message);
    }

    public InvalidCollectCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}