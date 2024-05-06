package br.com.cc.exception.complaint;

public class ComplaintNotFoundException extends RuntimeException {

    public ComplaintNotFoundException() {
        super("Essa Denúncia não foi encontrada!");
    }

    public ComplaintNotFoundException(String message) {
        super(message);
    }
}