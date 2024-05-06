package br.com.cc.exception.user;

public class InvalidUserAdminDeletionException extends RuntimeException {

    public InvalidUserAdminDeletionException() {
        super("Não é possível deletar usuários administradores!");
    }

    public InvalidUserAdminDeletionException(String message) {
        super(message);
    }
}