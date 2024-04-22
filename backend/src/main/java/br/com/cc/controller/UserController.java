package br.com.cc.controller;

import br.com.cc.dto.UserDTO;
import br.com.cc.entity.User;
import br.com.cc.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserServiceImpl userServiceImpl;

	@GetMapping
	public ResponseEntity<List<User>> findAll() {
		List<User> users = userServiceImpl.findAll();
		return ResponseEntity.ok(users);
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> findById(@PathVariable Long id) {
		return userServiceImpl.findById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = userServiceImpl.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User user) {
		User updatedUser = userServiceImpl.updateById(id, user);
		return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
	}

	@PostMapping
	public ResponseEntity<User> create(@RequestBody User user) {
		User savedUser = userServiceImpl.create(user);
		return ResponseEntity.ok(savedUser);
	}
}