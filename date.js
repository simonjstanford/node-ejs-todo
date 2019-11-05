exports.getDate = function getDate() {
  let date = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  return date.toLocaleDateString("en-GB", options);
}
