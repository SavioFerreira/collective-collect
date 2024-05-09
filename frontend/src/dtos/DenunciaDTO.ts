export type DenunciaDTO = {

	id: number | undefined,
	author: {
		id: number;
	},
	title: string,
	description: string,
	locale: string,
	date: string,
	gravity: string,
	image: string,
	status: string | undefined,
	type: string,
}