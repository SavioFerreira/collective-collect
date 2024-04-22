package br.com.cc.service;

import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.repository.CollectRepository;
import br.com.cc.repository.ComplaintRepository;
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

	@Transactional
	public Complaint save(Complaint complaint) {
		Complaint savedComplaint = complaintRepository.save(complaint);
		createAndSaveCollectForComplaint(savedComplaint);
		return savedComplaint;
	}

	@Transactional
	public boolean deleteById(Long id) {
		Optional<Complaint> complaint = complaintRepository.findById(id);
		if (complaint.isPresent()) {
			Collect collect = collectRepository.findByComplaintId(id).orElse(null);
			if (collect != null) {
				collectRepository.delete(collect);
			}
			complaintRepository.delete(complaint.get());
			return true;
		}
		return false;
	}

	public Complaint updateById(Long id, Complaint updateComplaint) {
		Optional<Complaint> existingComplaint = complaintRepository.findById(id);
		if (existingComplaint.isPresent()) {
			Complaint currentComplaint = existingComplaint.get();
			updateComplaint.setId(currentComplaint.getId());
			Complaint savedComplaint = complaintRepository.save(updateComplaint);
			updateCollectForComplaint(savedComplaint);
			return savedComplaint;
		}
		return null;
	}

	private void updateCollectForComplaint(Complaint complaint) {
		collectRepository.findByComplaintId(complaint.getId()).ifPresent(collect -> {
			collect.setDate(complaint.getDate());
			collect.setStatus(complaint.getStatus());
			collect.setWasteInfo(complaint.getWasteInfo());

			collectRepository.save(collect);
		});
	}

	private void createAndSaveCollectForComplaint(Complaint complaint) {
		Collect collect = new Collect();
		collect.setComplaint(complaint);
		collect.setStatus(complaint.getStatus());
		collect.setDate(complaint.getDate());
		collect.setWasteInfo(complaint.getWasteInfo());
		collectRepository.save(collect);
	}
}
