export type DenunciaDTO = {

	id: number,
	author: {
		id: number;
	},
	title: string,
	description: string,
	locale: string,
	date: string,
	gravity: string,
	image: string,
	status: string,
	type: string,
}