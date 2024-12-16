document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((aTag) =>
  aTag.addEventListener("click", click)
);

function click(this: HTMLAnchorElement, event: MouseEvent): void {
  event.preventDefault();
  document.querySelector(this.hash)?.scrollIntoView();
}
