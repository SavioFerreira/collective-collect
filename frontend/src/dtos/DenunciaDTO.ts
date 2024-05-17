export type DenunciaDTO = {

	id: number | undefined,
	author: {
		id: number;
	},
	title: string,
	description: string,
	locale: {
		address: string;
		latitude: number | undefined;
		longitude: number | undefined;
	}
	complaintDate: string,
	gravity: string,
	image: string,
	status: string | undefined,
	type: string,
}