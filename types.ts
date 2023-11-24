export type WorkSpace = {
	workspace: {
		resolver: string,
		members: string[]
	}
}

export type Package = {
	package: {
		name: string,
		version: string,
		edition: string
	}
}

export type Scripts = Record<string, { hash: string, version: string }>
