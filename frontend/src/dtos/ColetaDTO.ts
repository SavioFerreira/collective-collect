import { UserDTO } from "./UserDTO";

export type ColetaDTO = {
		id: number,
		status: string,
		type: string,
		gravity: string,
		collectDate: string,
		complaintDate: string,
		image: string,
		collectImage: string,
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
	}