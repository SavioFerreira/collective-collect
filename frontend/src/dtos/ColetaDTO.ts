import { UserDTO } from "./UserDTO";

export type ColetaDTO = {
		id: number,
		status: string,
		type: string,
		gravity: string,
		collectDate: string,
		complaintDate: string,
		image: string,
		collectImageBefore: string,
		collectImageAfter: string,
		complaintImage: string,
		title: string,
		description:string,
		locale: {
			address: string;
			latitude: number;
			longitude: number;
		}
		complaintId: number,
		collaborators: [UserDTO],
		teamCollect: boolean;
		leaderId: number;
	}