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

export type Props = Record<string, string | boolean> | null
export type Children = [ HTMLElement | Promise<HTMLElement> | [ HTMLElement | Promise<HTMLElement> ] ] | undefined[]
export default function x<T extends HTMLElement>(typeOrFunc: string | ((props: Props, ...children: Children) => T), props: Props = null, ...children: Children) {
	if (typeof typeOrFunc !== 'string')
		return typeOrFunc(props, ...children)

	const parentTag = document.createElement(typeOrFunc) as T
	if (props)
		Object.entries(props).forEach(([ key, value ]) => typeof value === 'boolean' ? parentTag.toggleAttribute(key, value) : parentTag.setAttribute(key, value))
	children.flat().forEach(async childTag => {
		if (childTag == undefined)
			return
		if (childTag.toString() !== '[object Promise]')
			return parentTag.append(childTag as HTMLElement)
		const divTag = <div /> as HTMLDivElement
		parentTag.append(divTag)
		childTag = await childTag
		if (divTag.parentElement) {
			divTag.parentElement.insertBefore(childTag, divTag)
			divTag.remove()
		}
	})
	return parentTag
}

export function y(_props: Props, ...children: Children) {
	return children
}
