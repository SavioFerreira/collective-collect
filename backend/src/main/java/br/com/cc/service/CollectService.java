package br.com.cc.service;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.dto.CollectValidationDTO;
import br.com.cc.entity.Collect;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CollectService {

    Collect create(Collect collect);

    void addCollaboratorToCollect(Long collectId, CollectCollaboratorDTO collaboratorDTO);

    void startCollect(Long id);

    void completeCollect(Long id, MultipartFile beforeImage, MultipartFile afterImage);

    void validateCollect(long id, CollectValidationDTO collectValidationDTO);

    List<Collect> findAll();

    Optional<Collect> findById(Long id);

    Collect updateById(Long id, Map<String, Object> updates);

    boolean deleteById(Long id);
}
