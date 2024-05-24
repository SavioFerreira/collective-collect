package br.com.cc.service.impl;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.enums.Status;
import br.com.cc.repository.CollectRepository;
import br.com.cc.repository.ComplaintRepository;
import br.com.cc.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintServiceImpl implements ComplaintService {

	@Autowired
	private ComplaintRepository complaintRepository;

	@Autowired
	private CollectRepository collectRepository;

	@Override
	public List<Complaint> findAll() {
		return complaintRepository.findAll();
	}

	@Override
	public Optional<Complaint> findById(Long id) {
		return complaintRepository.findById(id);
	}

	@Override
	@Transactional
	public Complaint create(Complaint complaint) {

		if(complaint.getId() != null) {
			throw new RuntimeException("para criar uma denúncia, você não pode ter um ID!");
		}
		complaint.setStatus(Status.DISPONIVEL);
		Complaint savedComplaint = complaintRepository.save(complaint);
		createAndSaveCollectForComplaint(savedComplaint);
		return savedComplaint;
	}

	@Override
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

	@Override
	public Complaint updateById(Long id, Complaint updateComplaint) {
		Optional<Complaint> existingComplaint = complaintRepository.findById(id);
		if (existingComplaint.isPresent()) {
			Complaint currentComplaint = existingComplaint.get();
			updateComplaint.setId(currentComplaint.getId());
			Complaint savedComplaint = complaintRepository.save(updateComplaint);
			updateCollectForComplaint(savedComplaint);
			return savedComplaint;
		}
		throw new RuntimeException("Digite um ID válido!");
	}

	private void updateCollectForComplaint(Complaint complaint) {
		collectRepository.findByComplaintId(complaint.getId()).ifPresent(collect -> {
			collect.setStatus(complaint.getStatus());
			collect.setWasteInfo(complaint.getWasteInfo());
			Collect savedCollect = collectRepository.save(collect);
			complaint.setCollect(savedCollect);
			complaintRepository.save(complaint);
		});
	}

	private void createAndSaveCollectForComplaint(Complaint complaint) {
		Collect collect = new Collect();
		collect.setComplaint(complaint);
		collect.setStatus(Status.DISPONIVEL);
		collect.setComplaintDate(complaint.getComplaintDate());
		collect.setTeamCollect(true);
		collect.setWasteInfo(complaint.getWasteInfo());
		Collect savedCollect = collectRepository.save(collect);
		complaint.setCollect(savedCollect);
		complaintRepository.save(complaint);
	}
}
