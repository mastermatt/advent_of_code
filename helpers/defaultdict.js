/**
 * https://stackoverflow.com/a/44622467/823942
 */
module.exports = class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) => {
          if (!(name in target)) {
            target[name] =
              typeof defaultInit === "function"
                ? new defaultInit().valueOf()
                : defaultInit;
          }

          return target[name];
        }
      }
    );
  }
};
