package br.com.cc.controller;

import br.com.cc.entity.User;
import br.com.cc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;

	@PreAuthorize("hasRole('USER_CREATE')")
	@PostMapping
	public ResponseEntity<User> create(@RequestBody User user) {
		User savedUser = userService.create(user);
		return ResponseEntity.ok(savedUser);
	}

	@PreAuthorize("hasRole('USER_SELECT')")
	@GetMapping
	public ResponseEntity<List<User>> findAll() {
		List<User> users = userService.findAll();
		return ResponseEntity.ok(users);
	}

	@PreAuthorize("hasRole('USER_SELECT')")
	@GetMapping("/{id}")
	public ResponseEntity<User> findById(@PathVariable Long id) {
		return userService.findById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PreAuthorize("hasRole('USER_UPDATE')")
	@PutMapping("/{id}")
	public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User user) {
		User updatedUser = userService.updateById(id, user);
		return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
	}

	@PreAuthorize("hasRole('USER_DELETE')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = userService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}
}