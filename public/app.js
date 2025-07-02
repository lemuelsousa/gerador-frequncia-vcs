const date = new Date();
document.getElementById("month").value = `${date.getFullYear()}-0${
  date.getMonth() + 1
}`;
document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  const input = document.getElementById("names").value.trim();
  const month = e.target.month.value;
  if (!input) alert("por favor, insara ao menos um nome");
  const data = { names: input, month: month };

  try {
    const response = await fetch("http://localhost:3000/api/names", {
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
        a.download = `${month}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    form.reset();
  } catch (error) {
    alert("There was a problem: " + error.message);
  }
});
