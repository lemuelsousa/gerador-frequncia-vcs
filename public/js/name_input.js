import { nameValidationRules } from "./utils/name.js";

const MAX_NAMES = 10;

const addNameBtn = document.getElementById("addNameBtn");

const NAME_ID_PATTERN = "nameInput";
const allNameInputs = [];

export function createNameInput({ isRemovable }) {
  const wrapper = setupNameIputWrapper(
    document.getElementById("inputNameContainer")
  );
  setupNameInput({ parent: wrapper, isRemovable });
}

function createFieldWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-between items-center flex-wrap";
  parent.appendChild(wrapper);
  return wrapper;
}

export function setupNameInput({ isRemovable, parent }) {
  const id = `${NAME_ID_PATTERN}${MAX_NAMES - (MAX_NAMES - allNameInputs.length)}`;
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.placeholder = "Insira o nome completo do voluntário";
  newInput.required = true;
  newInput.className =
    "w-md rounded-md border border-gray-300 px-3 py-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500";
  newInput.id = id;
  newInput.minLength = "2";
  newInput.maxLength = "100";

  parent.appendChild(newInput);

  if (isRemovable) {
    const removeBtn = createRemoveButton(() => wrapper.remove());
    wrapper.appendChild(removeBtn);
  }

  const errorDiv = document.createElement("div");
  errorDiv.id = `${id}--error`;
  errorDiv.className = "error-message text-red-500 text-sm w-full pt-2 pl-2";
  parent. appendChild(errorDiv);


  const validator = new FieldValidator(id, nameValidationRules);
  validator.setupEventListeners();

  newInput.focus();
  allNameInputs.push(newInput);
}

addNameBtn.addEventListener("click", () => {
  
  if (document.getElementsByClassName("invalid").length > 0) {
    alert("Por favor, corrija os campos inválidos antes de adicionar mais um nome");
    return;
  }

  if (allNameInputs.length > MAX_NAMES) {
    alert("limite de nomes excedido");
    return;
  }

  createNameInput({ isRemovable: true });
});

export function getAllNames() {
  return allNameInputs.map((name) => name.value);
}

class FieldValidator {
  constructor(fieldId, rules) {
    this.filed = document.getElementById(fieldId);
    this.errorDiv = document.getElementById(`${fieldId}--error`);
    this.rules = rules;
    this.isValid = false;
  }

  setupEventListeners() {
    this.filed.addEventListener("input", (e) => {
      this.validateField(e.target.value, "input");
    });

    this.filed.addEventListener("blur", (e) => {
      this.validateField(e.target.value, "blur");
    });

    this.filed.addEventListener("focus", (e) => {
      this.validateField(e.target.value, "focus");
    });
  }

  validateField(value, trigger) {
    if (trigger === "input" && value.length === 1) {
      return;
    }

    this.clearValidation();

    if (!value.trim()) {
      if (trigger === "blur") {
        this.showError("Este campo é obrigatório");
      }
      return;
    }

    for (const rule of this.rules) {
      if (!rule.test(value.trim())) {
        this.showError(rule.message);
        return;
      }
    }
    this.showSuccess();
  }

  clearValidation() {
    this.errorDiv.textContent = "";
    this.filed.classList.remove("valid", "invalid");
  }

  showError(message) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.color = "red";
    this.filed.classList.add("invalid");
    this.filed.classList.remove("valid");
    this.isValid = false;
  }

  showSuccess() {
    this.errorDiv.textContent = "✓ Válido";
    this.errorDiv.style.color = "green";
    this.filed.classList.add("valid");
    this.filed.classList.remove("invalid");
    this.isValid = true;
    
    setTimeout(() => {
      if (this.isValid) {
        this.errorDiv.textContent = "";
      }
    }, 2000);
  }
} 
