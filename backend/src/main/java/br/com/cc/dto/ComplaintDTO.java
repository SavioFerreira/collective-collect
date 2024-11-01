package br.com.cc.dto;

import br.com.cc.entity.Locale;
import br.com.cc.enums.Gravity;
import br.com.cc.enums.Status;
import br.com.cc.enums.WasteType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private Long id;
    private Long collectId;
    private Status status;
    private WasteType type;
    private Gravity gravity;
    private LocalDateTime complaintDate;
    private String image;
    private String title;
    private String description;
    private Locale locale;
    private UserDTO author;
}