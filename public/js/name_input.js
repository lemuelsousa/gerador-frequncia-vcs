const MAX_NAMES = 10;

const container = document.getElementById("inputNameContainer");
const addNameBtn = document.getElementById("addNameBtn");

const NAME_ID_PATTERN = "nameInput";
const allNameInputs = [];

export function createNameInput({ isRemovable }) {
  const wrapper = setupNameIputWrapper(
    document.getElementById("inputNameContainer")
  );
  setupNameInput({ parent: wrapper, isRemovable });
}

function setupNameIputWrapper(parent) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-between items-center";
  parent.appendChild(wrapper);
  return wrapper;
}

export function setupNameInput({ isRemovable, parent }) {
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.placeholder = "Insira o nome completo do voluntário";
  newInput.required = true;
  newInput.className =
    "w-md rounded-md border border-gray-300 px-3 py-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500";
  newInput.id = `${NAME_ID_PATTERN}${
    MAX_NAMES - (MAX_NAMES - allNameInputs.length)
  }`;
  newInput.minLength = "2";
  newInput.maxLength = "100";

  newInput.addEventListener("input", () => {
    const value = newInput.value.trim();
    const validation = validateName(value);
    if (!validation.isValid) {
      newInput.setCustomValidity(`Nome inválido!\n${validation.message}`);
      return;
    }
    newInput.setCustomValidity("");
  });

  parent.appendChild(newInput);

  if (isRemovable) {
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "x";
    removeBtn.title = "remover campo";
    removeBtn.className =
      "text-red-500 w-10 h-8 rounded-md text-sm cursor-pointer hover:shadow-lg hover:border-red-400 hover:border hover:-translate-0.5 flex justify-center items-center shadow-md active:bg-red-800";
    removeBtn.type = "button";

    removeBtn.addEventListener("click", () => {
      const index = allNameInputs.indexOf(newInput);
      if (index > -1) {
        allNameInputs.splice(index, 1);
        console.log(`inputs length updated: ${allNameInputs.length}`);
      }
      parent.remove();
    });
    parent.appendChild(removeBtn);
  }

  newInput.focus();
  allNameInputs.push(newInput);
}

addNameBtn.addEventListener("click", () => {
  const lastName = document.getElementById(
    `nameInput${allNameInputs.length - 1}`
  );
  const value = lastName.value;
  if (!validateName(value).isValid) {
    alert("preencha com um nome válido ou remova o campo");
    lastName.focus();
    return;
  }

  if (allNameInputs.length > MAX_NAMES) {
    alert("limite de nomes excedido");
    return;
  }

  createNameInput({ isRemovable: true });
});

function validateName(str) {
  return {
    isValid: !/^[\p{L}\s]+$/u.test(str) || str === "" ? false : true,
    message: "o nome deve conter apenas letras e espaçamentos",
  };
}

export function getAllNames() {
  return allNameInputs.map((name) => name.value);
}
