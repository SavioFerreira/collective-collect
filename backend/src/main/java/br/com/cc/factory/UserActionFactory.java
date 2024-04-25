package br.com.cc.factory;

import br.com.cc.entity.User;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;

public class UserActionFactory {

    public static Complaint createComplaint(User author) {
        Complaint complaint = new Complaint();
        complaint.setAuthor(author);
        // todo - Inicialize outros atributos padrões conforme necessário
        return complaint;
    }

    public static Collect createCollect(User collector) {
        Collect collect = new Collect();
        // todo - Assuma que um usuário pode iniciar uma coleta
        collect.getCollaborators().add(collector);
        // todo - Inicialize outros atributos padrões conforme necessário
        return collect;
    }
}