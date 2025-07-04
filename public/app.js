const date = new Date();
document.getElementById("month").value = `${date.getFullYear()}-0${
  date.getMonth() + 1
}`;
document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  const inputNames = document.getElementById("names").value.trim();
  if (!inputNames) alert("por favor, insara ao menos um nome");

  const monthValue = e.target.month.value; // yyyy-mm
  const data = { names: inputNames, month: monthValue };

  try {
    fetch("https://gerador-frequncia-vcs.onrender.com", {
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
        a.download = `${monthValue}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
    form.reset();
  } catch (error) {
    console.error("There was a problem: " + error.message);
  }
});
