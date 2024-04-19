package br.com.cc.dto;

import br.com.cc.enums.Gravity;
import br.com.cc.enums.Status;
import br.com.cc.enums.WasteType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectDTO {
    private Long id;
    @NotNull
    private Long complaintId;
    private LocalDateTime date;
    private Status status;
    private String collectImage;
    private Set<UserDTO> collaborators;

    private String title;
    private String description;
    private String locale;
    private String complaintImage;
    private WasteType type;
    private Gravity gravity;
}