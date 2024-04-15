package br.com.cc.services;

import java.util.List;
import java.util.Optional;

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

}