package br.com.cc.factories;

import br.com.cc.entities.Collect;
import br.com.cc.entities.Complaint;
import br.com.cc.entities.User;

public class UserActionFactory {

    public static Complaint createComplaint(User author) {
        Complaint complaint = new Complaint();
        complaint.setAuthor(author);

        //TODO

        return complaint;
    }

    public static Collect createCollect(User collector) {
        Collect collect = new Collect();

        //TODO

        collect.getCollaborators().add(collector);
        return collect;
    }
}