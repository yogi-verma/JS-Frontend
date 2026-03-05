/* Extract code snippet from question text for display */
export const extractCode = (text) => {
  const match = text.match(/\n\n([\s\S]+)$/);
  return match ? match[1] : null;
};

export const extractTitle = (text) => {
  const match = text.match(/^(.+?)(\n|$)/);
  return match ? match[1] : text;
};
