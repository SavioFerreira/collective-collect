package br.com.cc.service;
import br.com.cc.entity.Complaint;
import java.util.List;
import java.util.Optional;

public interface ComplaintService {

    Complaint create(Complaint complaint);

    List<Complaint> findAll();

    Optional<Complaint> findById(Long id);

    Complaint updateById(Long id, Complaint updateComplaint);

    boolean deleteById(Long id);

}
