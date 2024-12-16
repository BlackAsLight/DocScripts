import { lock, sleep } from "./utils.ts";

export function Token(
  func: (token: string) => string | null | void | Promise<string | null | void>,
): Promise<void> {
  return lock("Doc_Token", async () => {
    let token = sessionStorage.getItem("Doc_Token") ??
      document.querySelector<HTMLInputElement>('input[name="token"]')?.value;
    if (token == undefined) {
      let response: Response;
      let dom: Document;
      while (true) {
        response = await fetch("https://politicsandwar.com/city/");
        if (response.status !== 200) {
          throw `Failed to get Token | Status Code: ${response.status}`;
        }
        dom = new DOMParser().parseFromString(
          await response.text(),
          "text/html",
        );
        token = dom.querySelector<HTMLInputElement>('input[name="token"]')
          ?.value;
        if (token) {
          break;
        }
        if (
          dom.querySelector<HTMLImageElement>('img[alt="Politics & Snore"]')
        ) {
          await sleep(5000);
        } else {
          throw new Error("Failed to get Token | Token not Found");
        }
      }
    }

    const response = await func(token);
    if (response === undefined) {
      return;
    }
    if (response === null) {
      return sessionStorage.removeItem("Doc_Token");
    }
    sessionStorage.setItem("Doc_Token", response);
  });
}
