package br.com.cc.mapper;
import br.com.cc.entity.User;
import br.com.cc.dto.CollectDTO;
import br.com.cc.dto.UserDTO;
import br.com.cc.entity.Collect;
import br.com.cc.entity.WasteInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CollectMapperService {

    @Autowired
    private UserMapperService userMapperService;

    public CollectDTO convertCollectToDTO(Collect collect) {
        CollectDTO dto = new CollectDTO();
        dto.setId(collect.getId());
        dto.setStatus(collect.getStatus());
        dto.setCollectDate(collect.getCollectDate());
        dto.setComplaintDate(collect.getComplaint().getComplaintDate());
        dto.setCollectImageBefore(collect.getCollectImageBefore());
        dto.setCollectImageAfter(collect.getCollectImageAfter());
        dto.setLeaderId(collect.getLeaderId());
        dto.setGravity(collect.getWasteInfo().getGravity());
        dto.setType(collect.getWasteInfo().getWasteType());
        dto.setTitle(collect.getWasteInfo().getTitle());
        dto.setDescription(collect.getWasteInfo().getDescription());
        dto.setLocale(collect.getWasteInfo().getLocale());
        dto.setComplaintImage(collect.getWasteInfo().getImage());
        dto.setComplaintId(collect.getComplaint() != null ? collect.getComplaint().getId() : null);
        dto.setTeamCollect(collect.isTeamCollect());
        dto.setCollaborators(convertToUserDTOSet(collect.getCollaborators()));
        return dto;
    }

    public Collect convertCollectDtoToEntity(CollectDTO dto) {
        Collect collect = new Collect();
        collect.setId(dto.getId());
        collect.setStatus(dto.getStatus());
        collect.setCollectDate(dto.getCollectDate());
        collect.setComplaintDate(dto.getComplaintDate());
        collect.setCollectImageBefore(dto.getCollectImageBefore());
        collect.setCollectImageAfter(dto.getCollectImageAfter());
        collect.setTeamCollect(dto.isTeamCollect());
        collect.setLeaderId(dto.getLeaderId());
        collect.setCollaborators(convertToUserEntitySet(dto.getCollaborators()));

        WasteInfo wasteInfo = new WasteInfo();
        wasteInfo.setImage(dto.getComplaintImage());
        wasteInfo.setTitle(dto.getTitle());
        wasteInfo.setDescription(dto.getDescription());
        wasteInfo.setLocale(dto.getLocale());
        wasteInfo.setWasteType(dto.getType());
        wasteInfo.setGravity(dto.getGravity());
        collect.setWasteInfo(wasteInfo);

        return collect;
    }

    public Set<UserDTO> convertToUserDTOSet(Set<User> users) {

        return users.stream()
                .map(userMapperService::convertUserToDTO)
                .collect(Collectors.toSet());
    }

    public Set<User> convertToUserEntitySet(Set<UserDTO> users) {

        return users.stream()
                .map(userMapperService::convertUserToEntity)
                .collect(Collectors.toSet());
    }

}
