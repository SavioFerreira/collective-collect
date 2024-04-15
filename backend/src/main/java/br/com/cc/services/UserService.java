package br.com.cc.services;

import java.util.List;
import java.util.Optional;

import br.com.cc.entities.Collect;
import br.com.cc.entities.Complaint;
import br.com.cc.factories.UserActionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.cc.entities.User;
import br.com.cc.repositories.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public List<User> findAll() {

		return userRepository.findAll();
	}

	public ResponseEntity<User> findById(Long id) {

		Optional<User> user = userRepository.findById(id);

		if (user.isPresent()) {
			return ResponseEntity.ok(user.get());
		}
		return ResponseEntity.notFound().build();

	}

	public ResponseEntity<User> deletebyId(Long id) {

		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<User> updateById(Long id, User updateUser) {

		if (userRepository.existsById(id)) {
			updateUser.setId(id);
			return ResponseEntity.ok(userRepository.save(updateUser));
		}
		return ResponseEntity.notFound().build();
	}

	public User save(User user) {
		return userRepository.save(user);
	}

	public Complaint registerComplaint(User user) {
		Complaint complaint = UserActionFactory.createComplaint(user);


		// TODO - Salvar a reclamação no banco de dados aqui

		return complaint;
	}

	public Collect startCollect(User user) {
		Collect collect = UserActionFactory.createCollect(user);

		// TODO - Salvar a coleta no banco de dados aqui

		return collect;
	}

}
