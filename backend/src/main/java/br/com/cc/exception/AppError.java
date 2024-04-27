package br.com.cc.exception;

import lombok.Data;

@Data
public class AppError  {
    private String status;
    private String message;

    public AppError(String message) {
        this.message = message;
    }

    public AppError(String message, String status) {
       this.message = message;
       this.status = status;
    }

}
