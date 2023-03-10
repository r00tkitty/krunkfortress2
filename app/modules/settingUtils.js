//thanks gato i love you
const Store = require("electron-store");
const { keyFromCode } = require("./utils");
const userPrefs = new Store();

const additionalInfoHTML = [
    ``, // Default
    `<span style="color: #eb5656">*</span>`, // Requires Restart
    `<span style="color: #568aeb">*</span>`  // Requires Refresh
]

class settingsUtils {
    static collapseCategory(id) {
        var settForm = document.getElementById('clientForm');
        var _catHed = document.getElementById("setHed_" + id);
        var _catBody = document.getElementById("setBod_" + id);
        if (_catHed.classList.contains("collapsed")) {
            _catHed.classList.remove("collapsed");
            _catBody.style = "";
            _catHed.childNodes[0].innerHTML = "keyboard_arrow_down";
        } else {
            _catHed.classList.add("collapsed");
            _catBody.style = "display:none;";
            _catHed.childNodes[0].innerHTML = "keyboard_arrow_right";
        }
    }
    static createCategory(id, name) {
        var settForm = document.getElementById('clientForm');
        // Create Category Div
        var _category = document.createElement("div");
        _category.id = "setHed_" + id;
        _category.classList.add('setHed');
        settForm.appendChild(_category);
        // Add Arrow
        var _span = document.createElement("span");
        _span.classList.add('material-icons');
        _span.classList.add('plusOrMinus');
        _span.innerHTML = "keyboard_arrow_down";
        _category.appendChild(_span);
        // Add Name
        _category.innerHTML += name;
        // Add Settings Body
        var _settingBody = document.createElement("div");
        _settingBody.id = "setBod_" + id;
        _settingBody.classList.add('setBodH');
        settForm.appendChild(_settingBody);
        // Add Click Event
        _category.onclick = function () {
            settingsUtils.collapseCategory(id);
        };
    }
    static createCheckbox(id, name, description, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        _setting.innerHTML += `<label class="switch"> <input name="${id}" class="gatoSett" type="checkbox" ${userPrefs.get("clientSettings." + id) ? 'checked' : ''} ${disabled ? 'disabled' : ''}/> <span class="slider"><span class="grooves"></span></span> </label>`;
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
    }
    static createSlider(id, name, description, min, max, def, step, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        var value = userPrefs.get("clientSettings." + id);
        _setting.innerHTML += `<input type="number" class="sliderVal gatoSett" name="${id}" id="slid_input_${id}" min="${min}" max="${max}" value="${value != undefined ? value : def}" style="margin-right:0px;border-width:0px" ${disabled ? 'disabled' : ''}> <div class="slidecontainer" style="margin-top: -8px;"><input type="range" name="${id}" id="slid_${id}" min="${min}" max="${max}" step="${step}" value="${value != undefined ? value : def}" class="sliderM gatoSlider" ${disabled ? 'disabled' : ''}></div>`;
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
        var _inputBox = document.getElementById("slid_input_" + id);
        _inputBox.addEventListener("change", function (event) {
            document.getElementById("slid_" + id).value = _inputBox.value;
        });
    }
    static createDropdown(id, name, description, options, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        var _dropdown = document.createElement("select");
        _dropdown.classList.add("inputGrey2");
        _dropdown.classList.add("gatoSett");
        _dropdown.disabled = disabled;
        _dropdown.name = id;
        _setting.appendChild(_dropdown);
        for (var _i = 0; _i < options.length; _i++) {
            var _option = options[_i];
            _dropdown.innerHTML += `<option value="${_option[0]}" ${userPrefs.get("clientSettings." + id) == _option[0] ? 'selected' : ''}>${_option[1]}</option>`;
        }
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
    }
    static createTextInput(id, name, description, placeholder, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        var value = userPrefs.get("clientSettings." + id);
        _setting.innerHTML += `<input type="text" name="${id}" class="inputGrey2 gatoSett" placeholder="${placeholder}" value="${value != undefined ? value : ''}" ${disabled ? 'disabled' : ''}>`;
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
    }
    static createKeybindInput(id, name, description, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        var value = userPrefs.get("clientSettings." + id);
        var fakeInput = value != undefined ? value : '';
        if (fakeInput.substring(0, 1) != "M") {
            fakeInput = keyFromCode(fakeInput);
        }
        _setting.innerHTML += `<input type="text" name="${id}" id="fake_${id}" class="settText floatRNoC keyIcon gatoKey" placeholder="Enter Key" value="${fakeInput}" ${disabled ? 'disabled' : ''}>`;
        _setting.innerHTML += `<input type="hidden" name="${id}" id="${id}" class="gatoSett" placeholder="Enter Key" value="${value != undefined ? value : ''}" ${disabled ? 'disabled' : ''}>`;
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
        let _input = document.getElementById("fake_" + id);
        let _trueInput = document.getElementById(id);
        let _statusinput = document.getElementById("settingsInputDetails");
        if (_statusinput == null || _statusinput == undefined) {
            _statusinput = document.createElement("div");
            _statusinput.id = "settingsInputDetails"
        }
        function disableEventListener(event) {
            event.preventDefault();
            _input.value = "M" + event.button;
            _trueInput.value = "M" + event.button;
            settingsUtils.save();
            _input.blur();
            document.removeEventListener("mousedown", disableEventListener);
            _statusinput.setAttribute('awaitingInput', 'false');
            _statusinput.setAttribute('gotInput', 'true');
        };
        _input.addEventListener("keydown", (event) => {
            _input.value = event.key.toUpperCase();
            _trueInput.value = event.keyCode;
            settingsUtils.save();
            event.preventDefault();
            _input.blur();
            _statusinput.setAttribute('awaitingInput', 'false');
            document.removeEventListener("mousedown", disableEventListener);
        })
        _input.addEventListener("mouseup", (event) => {
            if (_statusinput.getAttribute('gotInput') == "true") {
                _statusinput.setAttribute('gotInput', 'false');
            } else {
                _statusinput.setAttribute('awaitingInput', 'true');
                _input.value = "";
                document.addEventListener("mousedown", disableEventListener);
            }
        });
    }
    static createButton(id, name, description, buttonText, callback, category, disabled, additionalInfo = 0) {
        var settForm = document.getElementById('clientForm');
        // Get Category Body
        var _catBody = document.getElementById("setBod_" + category);
        // Create Setting
        var _setting = document.createElement("div");
        _setting.classList.add('settName');
        _setting.title = description;
        _setting.textContent = name;
        _catBody.appendChild(_setting);
        _setting.innerHTML += additionalInfoHTML[additionalInfo];
        var _button = document.createElement("div");
        _button.classList.add('settingsBtn');
        _button.style = "width: auto;"
        _button.innerHTML = buttonText;
        _setting.appendChild(_button);
        if(userPrefs.get("clientSettings.settingDescriptions",false) == true){
            var _description = document.createElement("div");
            _description.style = "opacity:0.3;font-size:1rem";
            _description.textContent = description
            _setting.appendChild(_description)
        }
        _button.addEventListener("click", callback);
    }
    static save() {
        // Save Preferences/Settings
        var settForm = document.getElementById('clientForm');
        var _inputs = settForm.getElementsByTagName('input');
        var _dropdowns = settForm.getElementsByTagName('select');
        for (var i = 0; i < _inputs.length; i++) {
            if (_inputs[i].classList.contains("gatoSlider")) {
                document.getElementById("slid_input_" + _inputs[i].name).value = _inputs[i].value;
            }
        };
        for (var i = 0; i < _inputs.length; i++) {
            if (_inputs[i].classList.contains("gatoSett")) {
                if (_inputs[i].type == 'checkbox') {
                    userPrefs.set("clientSettings." + _inputs[i].name, _inputs[i].checked);
                }
                else {
                    userPrefs.set("clientSettings." + _inputs[i].name, _inputs[i].value.toString());
                }
            }
        };
        for (var i = 0; i < _dropdowns.length; i++) {
            if (_dropdowns[i].classList.contains("gatoSett")) {
                userPrefs.set("clientSettings." + _dropdowns[i].name, _dropdowns[i].value);
            }
        };
    }
    static hookSaving() {
        var settForm = document.getElementById('clientForm');
        settForm.addEventListener("change", function () {
            settingsUtils.save();
        });
    }
    static createForm() {
        const settHolder = document.getElementById('settHolder');
        settHolder.innerHTML = '<div id="settKey" style="position:absolute;"><div class="settKeyElement translateUpGato" style="color: #eb5656;">* Requires Restart</div><div class="settKeyElement translateUpGato" style="color: #568aeb">* Requires Refresh</div></div>';
        var settForm = document.createElement("form");
        settForm.id = "clientForm";
        settHolder.append(settForm);
    }
}
module.exports = settingsUtils