package br.com.cc.service;

import br.com.cc.entity.Collect;
import br.com.cc.repository.CollectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CollectService {

	@Autowired
	private CollectRepository collectRepository;

	public List<Collect> findAll() {
		return collectRepository.findAll();
	}

	public Optional<Collect> findById(Long id) {
		return collectRepository.findById(id);
	}

	public boolean deleteById(Long id) {
		if (collectRepository.existsById(id)) {
			collectRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public Optional<Collect> updateById(Long id, Collect updateCollect) {
		if (collectRepository.existsById(id)) {
			updateCollect.setId(id);
			return Optional.of(collectRepository.save(updateCollect));
		}
		return Optional.empty();
	}

	public Collect save(Collect collect) {
		return collectRepository.save(collect);
	}
}