package br.com.cc.services;

import br.com.cc.entities.Collect;
import br.com.cc.repositories.CollectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

	public ResponseEntity<Collect> findById(Long id) {

		Optional<Collect> collect = collectRepository.findById(id);

		if (collect.isPresent()) {
			return ResponseEntity.ok(collect.get());
		}
		return ResponseEntity.notFound().build();

	}

	public ResponseEntity<Collect> deletebyId(Long id) {

		if (collectRepository.existsById(id)) {
			collectRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<Collect> updateById(Long id, Collect updateCollect) {

		if (collectRepository.existsById(id)) {
			updateCollect.setId(id);
			return ResponseEntity.ok(collectRepository.save(updateCollect));
		}
		return ResponseEntity.notFound().build();
	}

	public Collect save(Collect collect) {
		return collectRepository.save(collect);
	}

}
