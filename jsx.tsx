// deno-lint-ignore-file no-explicit-any
declare global {
	namespace JSX {
		interface IntrinsicElements {
			[ elemName: string ]: any
		}
		interface ElementClass {
			render: any
		}
	}
}

export type Props = Record<string, string> | null
export type Children = [ HTMLElement | Promise<HTMLElement> ]
export default function x(typeOrFunc: string | ((props: Props, ...children: Children) => HTMLElement), props: Props, ...children: Children) {
	if (typeof typeOrFunc !== 'string')
		return typeOrFunc(props, ...children)

	const parentTag = document.createElement(typeOrFunc)
	if (props)
		Object.entries(props).forEach(([ key, value ]) => parentTag.setAttribute(key, value))
	children.flat().forEach(async childTag => {
		if (childTag.toString() !== '[object Promise]')
			return parentTag.append(childTag as HTMLElement)
		const divTag = <div /> as HTMLElement
		parentTag.append(divTag)
		childTag = await childTag
		if (divTag.parentElement) {
			divTag.parentElement.insertBefore(childTag, divTag)
			divTag.remove()
		}
	})
	return parentTag
}
