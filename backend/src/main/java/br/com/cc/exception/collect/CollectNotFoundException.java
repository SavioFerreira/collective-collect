package br.com.cc.exception.collect;

public class CollectNotFoundException extends RuntimeException {

    public CollectNotFoundException() {
        super("Essa Coleta não foi encontrada!");
    }

    public CollectNotFoundException(String message) {
        super(message);
    }
}