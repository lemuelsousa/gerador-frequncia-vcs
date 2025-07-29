import { nameValidationRules } from "./utils/name.js";

function createInputElement() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nome completo";
  input.className =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500";
  return input;
}

function createRemoveButton(onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.title = "Remover campo";
  btn.textContent = "Remover";
  btn.className =
    "text-white px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 text-sm";
  btn.addEventListener("click", onClick);
  return btn;
}

function validate(value) {
  const failures = nameValidationRules
    .filter((rule) => !rule.test(value))
    .map((rule) => rule.message);
  return failures;
}

function createFieldWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex gap-2 items-start";
  return wrapper;
}

function createErrorElement() {
  const small = document.createElement("small");
  small.className = "text-red-600 text-sm";
  return small;
}

export function createNameInput({ isRemovable = true } = {}) {
  const container = document.getElementById("inputNameContainer");
  const wrapper = createFieldWrapper();
  const input = createInputElement();
  const error = createErrorElement();

  input.addEventListener("input", () => {
    const errs = validate(input.value);
    if (errs.length > 0) {
      error.textContent = `O nome deve ${errs[0]}`;
    } else {
      error.textContent = "";
    }
  });

  wrapper.appendChild(input);
  if (isRemovable) {
    const removeBtn = createRemoveButton(() => wrapper.remove());
    wrapper.appendChild(removeBtn);
  }
  wrapper.appendChild(error);
  container.appendChild(wrapper);
}

export function getAllNames() {
  const container = document.getElementById("inputNameContainer");
  const inputs = container.querySelectorAll("input[type='text']");
  return Array.from(inputs)
    .map((i) => i.value.trim())
    .filter((v) => v.length > 0);
}

// wire add button
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addNameBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => createNameInput({ isRemovable: true }));
  }
});

