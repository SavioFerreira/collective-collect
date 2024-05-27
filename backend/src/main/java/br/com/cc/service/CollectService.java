package br.com.cc.service;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.entity.Collect;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface CollectService {

    Collect create(Collect collect);

    void addCollaboratorToCollect(Long collectId, CollectCollaboratorDTO collaboratorDTO);

    Optional<Collect> startCollect(Long id);

    Optional<Collect> completeCollect(Long id,  MultipartFile beforeImage,  MultipartFile afterImage);

    List<Collect> findAll();

    Optional<Collect> findById(Long id);

    Optional<Collect> updateById(Long id, Collect collect);

    boolean deleteById(Long id);
}
