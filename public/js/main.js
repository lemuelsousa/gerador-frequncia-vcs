import { createNameInput, getAllNames } from "./name_input.js";
import { submit } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  createNameInput({ isRemovable: false });

  const date = new Date();
  const formatedDate = `${date.getFullYear()}-0${date.getMonth() + 1}`; // yyyy-mmm

  const monthInput = document.getElementById("month");
  monthInput.value = formatedDate;

  document
    .getElementById("form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const date = e.target.month.value;

      const data = {
        names: getAllNames(),
        date: date,
        pdf: document.getElementById("pdf").checked,
      };

      await submit(data);
      location.reload();
    });
});
