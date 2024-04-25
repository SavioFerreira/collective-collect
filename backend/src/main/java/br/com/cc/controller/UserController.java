package br.com.cc.controller;
import br.com.cc.entity.User;
import br.com.cc.dto.UserDTO;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private UserMapperService userMapperService;

	@PostMapping
	public ResponseEntity<UserDTO> create(@RequestBody UserDTO userDTO) {
		User user = userMapperService.convertUserToEntity(userDTO);
		User saved = userService.create(user);
		return ResponseEntity.ok(userMapperService.convertUserToDTO(saved));
	}

	@GetMapping
	public ResponseEntity<List<UserDTO>> findAll() {
		List<User> users = userService.findAll();
		List<UserDTO> userDTOs = users.stream()
				.map(userMapperService::convertUserToDTO)
				.collect(Collectors.toList());
		return ResponseEntity.ok(userDTOs);
	}


	@GetMapping("/{id}")
	public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
		return userService.findById(id)
				.map(userMapperService::convertUserToDTO)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserDTO> updateById(@PathVariable Long id, @RequestBody UserDTO userDTO) {
		User user = userMapperService.convertUserToEntity(userDTO);
		User updatedUser = userService.updateById(id, user);
		return updatedUser != null ? ResponseEntity.ok(userMapperService.convertUserToDTO(updatedUser)) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = userService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}
}