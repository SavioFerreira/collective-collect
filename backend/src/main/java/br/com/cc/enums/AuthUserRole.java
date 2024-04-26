package br.com.cc.enums;

public enum AuthUserRole {
    ADMIN("admin"),
    AUTHOR("author"),
    USER("user");

    private String role;

    AuthUserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
