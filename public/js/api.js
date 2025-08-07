export async function submit(data) {
  try {
    const response = await fetch("/api/names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ocorreu um erro inesperado");
    }

    const blob = await response.blob();

    if (blob === 0) {
      throw new Error("Arquivo vazio recebido");
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freq-${data.date}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error.message);
    alert("Verifique os nomes informados ou tente mais tarde.");
  }
}
