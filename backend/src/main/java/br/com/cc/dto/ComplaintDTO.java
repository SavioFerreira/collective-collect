package br.com.cc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private Long id;
    private String status;
    private String type;
    private String gravity;
    private LocalDateTime date;
    private String image;
    private String title;
    private String description;
    private String locale;
    private UserDTO author;
}