package br.com.cc.exceptions;

public class InvalidCollectCreationException extends RuntimeException {

    public InvalidCollectCreationException(String message) {
        super(message);
    }

    public InvalidCollectCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}