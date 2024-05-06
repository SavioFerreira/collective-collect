package br.com.cc.infra;

import br.com.cc.exception.collect.CollectNotFoundException;
import br.com.cc.exception.collect.InvalidCollectCreationException;
import br.com.cc.exception.complaint.ComplaintNotFoundException;
import br.com.cc.exception.complaint.InvalidComplaintCreationException;
import br.com.cc.exception.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    // Exceções gerais
    @ExceptionHandler(RuntimeException.class)
    private ResponseEntity<AppError> runTimeErrorHandler(RuntimeException exception){
        AppError appError = new AppError(HttpStatus.NOT_FOUND,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
    }

    // Exceções de Denúncias
    @ExceptionHandler(ComplaintNotFoundException.class)
    private ResponseEntity<AppError> complaintNotFoundHandler(ComplaintNotFoundException exception){
        AppError appError = new AppError(HttpStatus.NOT_FOUND,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
    }

    @ExceptionHandler(InvalidComplaintCreationException.class)
    private ResponseEntity<AppError> InvalidComplaintCreationHandler(InvalidComplaintCreationException exception){
        AppError appError = new AppError(HttpStatus.BAD_REQUEST,exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(appError);
    }

    // Exceções de Coletas
    @ExceptionHandler(CollectNotFoundException.class)
    private ResponseEntity<AppError> collectNotFoundHandler(CollectNotFoundException exception){
        AppError appError = new AppError(HttpStatus.NOT_FOUND,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
    }

    @ExceptionHandler(InvalidCollectCreationException.class)
    private ResponseEntity<AppError> InvalidComplaintCreationHandler(InvalidCollectCreationException exception){
        AppError appError = new AppError(HttpStatus.BAD_REQUEST,exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(appError);
    }


    // Exceções de usuários e autenticação
    @ExceptionHandler(UserNotFoundException.class)
    private ResponseEntity<AppError> UserNotFoundHandler(UserNotFoundException exception){
        AppError appError = new AppError(HttpStatus.NOT_FOUND,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
    }

    @ExceptionHandler(InvalidUserCreationException.class)
    private ResponseEntity<AppError> invalidUserCreationHandler(InvalidUserCreationException exception){
        AppError appError = new AppError(HttpStatus.BAD_REQUEST,exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(appError);
    }

    @ExceptionHandler(InvalidUserEmailException.class)
    private ResponseEntity<AppError> invalidUserEmailHandler(InvalidUserEmailException exception){
        AppError appError = new AppError(HttpStatus.CONFLICT,exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(appError);
    }

    @ExceptionHandler(InvalidUserAdminDeletionException.class)
    private ResponseEntity<AppError> InvalidUserAdminDeletionHandler(InvalidUserAdminDeletionException exception){
        AppError appError = new AppError(HttpStatus.NOT_ACCEPTABLE,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(appError);
    }


    @ExceptionHandler(InvalidUserEmailPasswordException.class)
    private ResponseEntity<AppError> InvalidUserEmailPasswordHandler(InvalidUserEmailPasswordException exception){
        AppError appError = new AppError(HttpStatus.NOT_FOUND,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
    }
}
