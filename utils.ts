/* Types
-------------------------*/
export type None = undefined | null;
// deno-lint-ignore no-explicit-any
export type Forced = any;

/* Enums
-------------------------*/
export enum Resource {
  Money,
  Oil,
  Coal,
  Iron,
  Bauxite,
  Lead,
  Uranium,
  Food,
  Gasoline,
  Steel,
  Aluminum,
  Munitions,
  Credits,
}

export enum Market {
  Oil,
  Coal,
  Iron,
  Bauxite,
  Lead,
  Uranium,
  Food,
  Gasoline,
  Steel,
  Aluminum,
  Munitions,
  Credits,
}

/* Functions
-------------------------*/
export function sleep(ms: number): Promise<true> {
  return new Promise<true>((a) => setTimeout(() => a(true), ms));
}

export async function waitTilFalse(
  func: () => boolean,
  delay = 0,
): Promise<void> {
  while (func()) {
    await sleep(delay);
  }
}

export function filterMap<T, U>(
  array: T[],
  func: (element: T, i: number) => U | None,
): U[] {
  const input = [...array];
  const output: U[] = [];
  let i = 0;
  for (const element of input) {
    const result = func(element, i++);
    if (result != undefined) {
      output.push(result);
    }
  }
  return output;
}

export function capitalise(text: string): string {
  return filterMap(
    text.split(" "),
    (word) =>
      word
        ? word[0].toLocaleUpperCase() +
          word.slice(1).toLocaleLowerCase()
        : null,
  ).join(" ");
}

export function abs(integer: bigint): bigint {
  return integer < 0 ? integer * -1n : integer;
}

export function max(...integers: bigint[]): bigint {
  let max = integers.shift() as bigint;
  for (let i = 0; i < integers.length; ++i) {
    if (max < integers[i]) {
      max = integers[i];
    }
  }
  return max;
}

export function min(...integers: bigint[]): bigint {
  let min = integers.shift() as bigint;
  for (let i = 0; i < integers.length; ++i) {
    if (integers[i] < min) {
      min = integers[i];
    }
  }
  return min;
}

export function cusMax<T, U>(func: (value: T) => U, ...values: T[]): T {
  let maxValue = values.shift() as T;
  let maxResult = func(maxValue);
  for (let i = 0; i < values.length; ++i) {
    const result = func(values[i]);
    if (maxResult < result) {
      maxValue = values[i];
      maxResult = result;
    }
  }
  return maxValue;
}

export function cusMin<T, U>(func: (value: T) => U, ...values: T[]): T {
  let minValue = values.shift() as T;
  let minResult = func(minValue);
  for (let i = 0; i < values.length; ++i) {
    const result = func(values[i]);
    if (result < minResult) {
      minValue = values[i];
      minResult = result;
    }
  }
  return minValue;
}

export function uniqueRandomID(): string {
  const char = "abcdefghijklmnopqrstuvwxyz";
  let id: string;
  do {
    id = "";
    for (let i = 0; i < 50; ++i) {
      id += char[Math.floor(Math.random() * 26)];
    }
  } while (document.querySelector(`#${id}`));
  return id;
}

export function endTime(startTime: number): string {
  const endTime = performance.now();
  return (endTime - startTime).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  }) + "ms";
}

export function passIfTruthy<T>(x: T | None, func: (x: T) => void): None | T {
  if (x) {
    func(x);
  }
  return x;
}

// deno-lint-ignore no-explicit-any
export function pass<T>(x: T, func: (x: T) => any): T {
  func(x);
  return x;
}

export function wrap<T, U>(x: T, func: (x: T) => U): U {
  return func(x);
}

export async function attemptPromise<T, U>(
  func: () => Promise<T>,
  // deno-lint-ignore no-explicit-any
  error: ((e: any) => Promise<U>) | None = undefined,
): Promise<T | U | undefined> {
  try {
    return await func();
  } catch (e) {
    if (error != undefined) {
      return await error(e);
    }
    console.error(e);
  }
}

export function attempt<T, U>(
  func: () => T,
  // deno-lint-ignore no-explicit-any
  error: ((e: any) => U) | None = undefined,
): T | U | undefined {
  try {
    return func();
  } catch (e) {
    if (error != undefined) {
      return error(e);
    }
    console.error(e);
  }
}

export function formatDate(date = new Date()): string {
  let text = "";
  text += date.getHours().toString().padStart(2, "0");
  text += ":";
  text += date.getMinutes().toString().padStart(2, "0");
  text += " ";
  text += date.getDate().toString().padStart(2, "0");
  text += "/";
  text += [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][date.getMonth()];
  text += "/";
  text += date.getFullYear();
  return text;
}

export function formatNumber(number: number, digits = 2): string {
  return number.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function formatBigInt(x: bigint): string {
  return `${(x / 100n).toLocaleString("en-US", { maximumFractionDigits: 0 })}.${
    (x % 100n).toString().padStart(2, "0")
  }`;
}
