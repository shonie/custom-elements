export const getAttributeMap = el =>
  new Map(el.getAttributeNames().map(name => [name, el.getAttribute(name)]));

export const createObserver = (element, mutationMap) => {
  const observer = new MutationObserver(mutations =>
    mutations.map(m => {
      if (mutationMap[m.type] instanceof Function) {
        mutationMap[m.type](m);
      }
    })
  );

  const observe = () =>
    observer.observe(
      element,
      Object.keys(mutationMap).reduce(
        (options, mutationType) => ({
          ...options,
          [mutationType]: true,
        }),
        {}
      )
    );

  const disconnect = () => observer.disconnect();

  return {
    observe,
    disconnect,
  };
};
