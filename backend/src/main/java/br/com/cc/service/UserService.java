package br.com.cc.service;

import java.util.List;
import java.util.Optional;

import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.factory.UserActionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cc.entity.User;
import br.com.cc.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public List<User> findAll() {
		return userRepository.findAll();
	}

	public Optional<User> findById(Long id) {
		return userRepository.findById(id);
	}

	public boolean deleteById(Long id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public User updateById(Long id, User updateUser) {
		if (userRepository.existsById(id)) {
			updateUser.setId(id);
			return userRepository.save(updateUser);
		}
		return null;
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
