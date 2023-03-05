export function asSafeArray<T>(input: T | T[] | null) {
  if (!input) {
    return [];
  }

  if (!Array.isArray(input)) {
    return [];
  }

  return input;
}

export function asSafeElement<T>(input: T | T[] | null) {
  if (Array.isArray(input)) {
    return null;
  }

  return input;
}

export function asElement<T>(input: T | T[] | null) {
  if (!input) {
    throw new Error(`Expected element for input, got null`);
  }

  if (Array.isArray(input)) {
    throw new Error(`Expected element for input, got array`);
  }

  return input;
}
