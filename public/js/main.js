import { createNameInput, getAllNames } from "./name_input.js";
import { submit } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  createNameInput({ isRemovable: false });

  const date = new Date();
  const formatedDate = `${date.getFullYear()}-0${date.getMonth() + 1}`; // yyyy-mmm

  const monthInput = document.getElementById("month");
  monthInput.value = formatedDate;

  const overlay = document.getElementById("loadingOverlay");
  const form = document.getElementById("form");
  const submitBtn = form.querySelector('button[type="submit"]');

  function showLoading() {
    if (!overlay) return;
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
  }

  function hideLoading() {
    if (!overlay) return;
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }

  form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const date = e.target.month.value;

      const data = {
        names: getAllNames(),
        date: date,
        pdf: document.getElementById("pdf").checked,
      };

      try {
        showLoading();
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        }
        await submit(data);
      } finally {
        // Reload regardless of success; server errors are alerted in submit()
        location.reload();
        // In case reload is blocked or delayed, revert UI state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
        hideLoading();
      }
    });
});
