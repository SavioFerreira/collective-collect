package br.com.cc.service.impl;
import br.com.cc.dto.ChatDTO;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.dto.CollectValidationDTO;
import br.com.cc.entity.Collect;
import br.com.cc.enums.Status;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.repository.CollectRepository;
import br.com.cc.service.ChatService;
import br.com.cc.service.CollectService;
import br.com.cc.service.ImageStorageService;
import br.com.cc.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CollectServiceImpl implements CollectService {


	private final CollectRepository collectRepository;

	private final UserMapperService userMapperService;

	private final ImageStorageService imageStorageService;

	private final MessageService messageService;

	private final ChatService chatService;

	@Override
	public List<Collect> findAll() {
		return collectRepository.findAll();
	}

	@Override
	public Optional<Collect> findById(Long id) {
		return collectRepository.findById(id);
	}

	@Override
	public boolean deleteById(Long id) {
		if (collectRepository.existsById(id)) {
			collectRepository.deleteById(id);
			return true;
		}
		return false;
	}

	@Override
	public Collect updateById(Long id, Map<String, Object> updates) {
		Optional<Collect> existingCollectOpt = collectRepository.findById(id);

		if (existingCollectOpt.isPresent()) {
			Collect existingCollect = existingCollectOpt.get();
			BeanWrapper wrapper = new BeanWrapperImpl(existingCollect);
			BeanWrapper wasteInfoWrapper = new BeanWrapperImpl(existingCollect.getWasteInfo());

			updates.forEach((key, value) -> {
				if (key.equals("status")) {
					if (wrapper.isWritableProperty(key)) {
						wrapper.setPropertyValue(key, value);
					}
				} else {
					if (wasteInfoWrapper.isWritableProperty(key)) {
						wasteInfoWrapper.setPropertyValue(key, value);
					}
				}
			});

			return collectRepository.save(existingCollect);
		}
		throw new RuntimeException("Digite um ID válido!");
	}

	@Override
	public Collect create(Collect collect) {

		if(collect.getComplaint().getId() == null) {
			throw new RuntimeException("não é possível criar uma coleta sem uma denúncia vinculada!");
		}
		collect.setStatus(Status.DISPONIVEL);
		return collectRepository.save(collect);
	}

	@Override
	public void addCollaboratorToCollect(Long collectId, CollectCollaboratorDTO collaboratorDTO) {
		Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new RuntimeException("Coleta não encontrada"));

		boolean isFirstCollaborator = collect.getCollaborators().isEmpty();

		if (isFirstCollaborator) {
			collect.setLeaderId(collaboratorDTO.getUser().getId());
			collect.setTeamCollect(collaboratorDTO.isTeamCollect());
			collect.setCollectDate(collaboratorDTO.getDate());
			collect.setStatus(Status.PENDENTE);
		} else {
			if (collect.getLeaderId().equals(collaboratorDTO.getUser().getId())) {
					collect.setTeamCollect(collaboratorDTO.isTeamCollect());
					collect.setCollectDate(collaboratorDTO.getDate());
			}
		}

		boolean isAlreadyCollaborator = collect.getCollaborators().stream()
				.anyMatch(user -> user.getId().equals(collaboratorDTO.getUser().getId()));

		if (!isAlreadyCollaborator) {
			collect.getCollaborators().add(userMapperService.convertUserToEntity(collaboratorDTO.getUser()));
		}

		collectRepository.save(collect);
	}

	@Override
	public void startCollect(Long id)  {
		collectRepository.findById(id).map(collect -> {
			collect.setStatus(Status.OCORRENDO);
			collect.setCollectDate(LocalDateTime.now());
			collectRepository.save(collect);
			return collect;
		});
	}

	@Override
	public void completeCollect(Long id, MultipartFile beforeImage, MultipartFile afterImage)  {
		collectRepository.findById(id).map(collect -> {
			collect.setCollectDate(LocalDateTime.now());
			String imageBeforeUrl = null;
			String imageAfterUrl = null;
			try {
				imageBeforeUrl = imageStorageService.uploadImage(beforeImage);
				imageAfterUrl = imageStorageService.uploadImage(afterImage);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			collect.setCollectImageBefore(imageBeforeUrl);
			collect.setCollectImageAfter(imageAfterUrl);
			collect.setStatus(Status.EM_ANALISE);
			collectRepository.save(collect);
			return collect;
		});
	}

	@Override
	public void validateCollect(long id, CollectValidationDTO collectValidationDTO) {
		collectRepository.findById(id).map(collect -> {
			collect.setStatus(collectValidationDTO.getStatus());
			ChatDTO chatDTO = chatService.getOrCreateChatByCollectId(id);

			if (collect.getStatus().equals(Status.REJEITADO)) {
				messageService.sendMessage(chatDTO.getChatId(), collectValidationDTO.getMessage());
			}

			if (collect.getStatus().equals(Status.APROVADO)){
				collect.getCollaborators().clear();
				chatService.deleteByCollectId(id);
			}

			collectRepository.save(collect);
			return collect;
		});
	}
}
