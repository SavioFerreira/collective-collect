package br.com.cc.infra;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class AppError {
    private HttpStatus status;
    private String message;
}
