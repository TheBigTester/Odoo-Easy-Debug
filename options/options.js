function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    iconOption: document.querySelector("#icon_set_option").value
  });
  console.log(document.querySelector("#icon_set_option"))
  alert(
    "Icon set updated!!!\n\n\n(Please note that you should refresh the page beetween each change)"
  );
}

function restoreOptions() {

  function setCurrentChoice(result) {
    var iconOption = 'default';
    if (typeof result !== 'undefined') {
        iconOption = result.iconOption || 'default';
    }
    document.querySelector("#icon_set_option").value = iconOption;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("iconOption");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);