package br.com.cc.exception;

import lombok.Data;

@Data
public class AppError extends Throwable {
    private String status;
    private Integer statusNumber;
    private String message;

    public AppError(String message) {
        this.message = message;
    }

    public AppError(String message, String status) {
       this.message = message;
       this.status = status;
    }

    public AppError(String message, Integer statusNumber) {
        this.message = message;
        this.statusNumber = statusNumber;
    }

}
