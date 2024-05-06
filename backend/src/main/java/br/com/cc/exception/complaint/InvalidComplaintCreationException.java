package br.com.cc.exception.complaint;

public class InvalidComplaintCreationException extends RuntimeException {

    public InvalidComplaintCreationException() {
        super("Não foi possível criar essa Denúncia!");
    }

    public InvalidComplaintCreationException(String message) {
        super(message);
    }
}