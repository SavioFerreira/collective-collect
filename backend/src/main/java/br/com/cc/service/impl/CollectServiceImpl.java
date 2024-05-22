package br.com.cc.service.impl;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.entity.Collect;
import br.com.cc.entity.User;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.enums.Status;
import br.com.cc.exception.collect.InvalidCollectRegistrationException;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.repository.CollectRepository;
import br.com.cc.service.CollectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CollectServiceImpl implements CollectService {

	@Autowired
	private CollectRepository collectRepository;

	@Autowired
	UserMapperService userMapperService;

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
	public Optional<Collect> updateById(Long id, Collect updateCollect) {
		if (collectRepository.existsById(id)) {
			updateCollect.setId(id);
			return Optional.of(collectRepository.save(updateCollect));
		}
		return Optional.empty();
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

		boolean isAuthor = collaboratorDTO.getUser().getId().equals(collect.getComplaint().getAuthor().getId());
		boolean isAlreadyCollaborator = collect.getCollaborators().stream().anyMatch(user -> user.getId().equals(collaboratorDTO.getUser().getId()));

		if (collect.getCollaborators().isEmpty() || isAuthor ) {
			collect.setTeamCollect(collaboratorDTO.isTeamCollect());
			collect.setCollectDate(collaboratorDTO.getDate());
		}

		if (isAlreadyCollaborator) {
			throw new InvalidCollectRegistrationException("Você já está registrado para essa coleta!");
		}

		if (collaboratorDTO.getUser().getRole().equals(AuthUserRole.ADMIN)) {
			collect.setTeamCollect(collaboratorDTO.isTeamCollect());
			collect.setCollectDate(collaboratorDTO.getDate());
		}

		if (!collaboratorDTO.isTeamCollect() || !isAuthor){
			throw new InvalidCollectRegistrationException("Essa coleta não está disponível para outros usuários!");
		}

		collect.getCollaborators().add(userMapperService.convertUserToEntity(collaboratorDTO.getUser()));
		collectRepository.save(collect);
	}
}
