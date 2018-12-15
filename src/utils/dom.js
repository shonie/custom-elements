export const createNode = (type, attributes = {}, elementCreationOptions = {}) => {
  const node = document.createElement(type, elementCreationOptions);

  for (const attribute of Object.keys(attributes)) {
    node.setAttribute(attribute, attributes[attribute]);
  }

  return node;
};
