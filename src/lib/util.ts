export const pipe =
  (...fns: Function[]) =>
  (arg: any) =>
    fns.reduce((v, f) => f(v), arg);
