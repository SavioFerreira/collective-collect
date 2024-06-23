package br.com.cc.enums;

import lombok.Getter;

@Getter
public enum AuthUserRole {
    ADMIN("admin"),
    AUTHOR("author"),
    USER("user");

    private final String role;

    AuthUserRole(String role){
        this.role = role;
    }

}
