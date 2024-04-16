package br.com.cc.services;

import br.com.cc.entities.Collect;
import br.com.cc.entities.Complaint;
import br.com.cc.repositories.CollectRepository;
import br.com.cc.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

	@Autowired
	private ComplaintRepository complaintRepository;

	@Autowired
	private CollectRepository collectRepository;

	public List<Complaint> findAll() {
		return complaintRepository.findAll();
	}

	public Optional<Complaint> findById(Long id) {
		return complaintRepository.findById(id);
	}

	public boolean deleteById(Long id) {
		if (complaintRepository.existsById(id)) {
			complaintRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public Complaint updateById(Long id, Complaint updateComplaint) {
		if (complaintRepository.existsById(id)) {
			updateComplaint.setId(id);
			return complaintRepository.save(updateComplaint);
		}
		return null;
	}

	@Transactional
	public Complaint save(Complaint complaint) {
		Complaint savedComplaint = complaintRepository.save(complaint);
		createAndSaveCollectForComplaint(savedComplaint);
		return savedComplaint;
	}

	private void createAndSaveCollectForComplaint(Complaint complaint) {
		Collect collect = new Collect();
		collect.setComplaint(complaint);
		collect.setStatus("Pendente");
		collect.setType(complaint.getType());
		collect.setGravity(complaint.getGravity());
		collect.setDate(complaint.getDate());
		collect.setImage(complaint.getImage());
		collect.setTitle(complaint.getTitle());
		collect.setDescription(complaint.getDescription());
		collect.setLocale(complaint.getLocale());
		collectRepository.save(collect);
	}
}
