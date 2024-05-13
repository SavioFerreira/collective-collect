package br.com.cc.service.impl;
import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.entity.Collect;
import br.com.cc.enums.Status;
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

		if (collect.getCollaborators().isEmpty()) {
			collect.setTeamCollect(collaboratorDTO.isTeamCollect());
			collect.setCollectDate(collaboratorDTO.getDate());
		}

		collect.getCollaborators().add(collaboratorDTO.getUser());
		collectRepository.save(collect);
	}
}
