const date = new Date();
document.getElementById("month").value = `${date.getFullYear()}-0${
  date.getMonth() + 1
}`;
document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  // validate names
  const namesInput = document.getElementById("names");
  if (!namesInput) alert("insira ao menos um nome");

  const pdfCheckbox = document.getElementById("pdf");

  const date = e.target.month.value; // yyyy-mm
  const data = {
    names: namesInput.value.trim(),
    date: date,
    pdf: pdfCheckbox.checked,
  };

  try {
    fetch("/api/names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${date}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
      namesInput.value = "";
  } catch (error) {
    console.error("There was a problem: " + error.message);
  }
});
