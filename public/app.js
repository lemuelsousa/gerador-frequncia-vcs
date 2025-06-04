document
  .getElementById("nameForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const form = event.target;

    const input = document.getElementById("names-input").value.trim();

    if (!input) alert("por favor, insara ao menos um nome");
    const data = { names: input };

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
          a.download = "generated.docx";
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
