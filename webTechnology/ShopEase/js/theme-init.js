(function () {
  var root = document.documentElement;
  var modes = ["normal", "bubblegum", "notebook", "cafe", "seaside"];
  var appearances = ["light", "dark", "system"];

  function read(key, fallback, allowed) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return allowed.indexOf(value) !== -1 ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  root.dataset.mode = read("shopease:mode", "normal", modes);
  root.dataset.appearance = read("shopease:theme", "system", appearances);
})();
