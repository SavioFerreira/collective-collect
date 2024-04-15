package br.com.cc.services;

import br.com.cc.entities.Collect;
import br.com.cc.entities.Complaint;
import br.com.cc.repositories.CollectRepository;
import br.com.cc.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

	@Autowired
	private ComplaintRepository complaintRepository;

	public List<Complaint> findAll() {

		return complaintRepository.findAll();
	}

	public ResponseEntity<Complaint> findById(Long id) {

		Optional<Complaint> complaint = complaintRepository.findById(id);

		if (complaint.isPresent()) {
			return ResponseEntity.ok(complaint.get());
		}
		return ResponseEntity.notFound().build();

	}

	public ResponseEntity<Complaint> deletebyId(Long id) {

		if (complaintRepository.existsById(id)) {
			complaintRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<Complaint> updateById(Long id, Complaint updateComplaint) {

		if (complaintRepository.existsById(id)) {
			updateComplaint.setId(id);
			return ResponseEntity.ok(complaintRepository.save(updateComplaint));
		}
		return ResponseEntity.notFound().build();
	}

	public Complaint save(Complaint complaint) {
		return complaintRepository.save(complaint);
	}

}
