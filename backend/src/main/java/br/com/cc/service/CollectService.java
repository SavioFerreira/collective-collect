package br.com.cc.service;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.entity.Collect;
import br.com.cc.enums.Status;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CollectService {

    Collect create(Collect collect);

    void addCollaboratorToCollect(Long collectId, CollectCollaboratorDTO collaboratorDTO);

    void startCollect(Long id);

    void completeCollect(Long id, MultipartFile beforeImage, MultipartFile afterImage);

    void validateCollect(long id, Status status);

    List<Collect> findAll();

    Optional<Collect> findById(Long id);

    Optional<Collect> updateById(Long id, Collect collect);

    boolean deleteById(Long id);
}
