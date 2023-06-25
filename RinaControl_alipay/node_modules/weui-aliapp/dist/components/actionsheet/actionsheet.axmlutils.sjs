var antmove_export = {};

var join = function (a, b) {
  return a + b;
};

var isNotSlot = function (v) {
  return typeof v !== 'string';
};

antmove_export = {
  join: join,
  isNotSlot: isNotSlot
};
export default antmove_export;