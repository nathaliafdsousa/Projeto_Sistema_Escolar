const API_URL = "https://school-system-spi.onrender.com/api/professores";

// Função utilitária para mostrar mensagens
function showMessage(msg, isError = false) {
  let box = document.getElementById("msg-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "msg-box";
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.zIndex = "9999";
    box.style.padding = "16px 32px";
    box.style.borderRadius = "10px";
    box.style.fontWeight = "bold";
    box.style.fontFamily = "inherit";
    box.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
    document.body.appendChild(box);
  }
  box.style.background = isError ? "#d32f2f" : "#43a047";
  box.style.color = "#fff";
  box.textContent = msg;
  box.style.display = "block";
  setTimeout(() => { box.style.display = "none"; }, 2500);
}

// CADASTRAR PROFESSOR
document.getElementById("professor-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.nome.value,
    materia: form.materia.value,
    observacao: form.observacao.value,
    idade: parseInt(form.idade.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar professor!");
    await response.json();
    showMessage("Professor cadastrado com sucesso!");
    form.reset();
    document.getElementById("listar-professores").click(); // Atualiza a lista automaticamente
  } catch (err) {
    showMessage("Erro ao cadastrar professor!", true);
    console.error(err);
  }
});

// LISTAR PROFESSORES
document.getElementById("listar-professores").addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar professores!");
    const professores = await res.json();

    const container = document.getElementById("professores-lista");
    container.innerHTML =
      professores
        .map(
          (p) => `
      <div>
        <strong>${p.nome}</strong> (ID: ${p.id})<br>
        Matéria: ${p.materia}<br>
        Observação: ${p.observacao || "-"}<br>
        Idade: ${p.idade ?? "-"}<br>
        <button onclick="editarProfessor(${p.id})">Editar</button>
        <button onclick="excluirProfessor(${p.id})">Excluir</button>
        <hr>
      </div>
    `
        )
        .join("") || "<div>Nenhum professor cadastrado.</div>";
    showMessage("Lista de professores carregada!");
  } catch (err) {
    showMessage("Erro ao listar professores!", true);
    console.error(err);
  }
});

// EDITAR PROFESSOR
window.editarProfessor = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar professor!");
    const professor = await res.json();

    document.getElementById("editar-id").value = professor.id;
    document.getElementById("editar-nome").value = professor.nome;
    document.getElementById("editar-materia").value = professor.materia;
    document.getElementById("editar-observacao").value = professor.observacao;
    document.getElementById("editar-idade").value = professor.idade;

    showMessage("Professor carregado para edição!");
  } catch (err) {
    showMessage("Erro ao carregar professor!", true);
    console.error(err);
  }
};

// ATUALIZAR PROFESSOR
document.getElementById("editar-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const professorId = document.getElementById("editar-id").value;
  const data = {
    nome: form["nome"].value,
    materia: form["materia"].value,
    observacao: form["observacao"].value,
    idade: parseInt(form["idade"].value),
  };

  try {
    const response = await fetch(`${API_URL}/${professorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar professor!");
    await response.json();
    showMessage("Professor atualizado com sucesso!");
    form.reset();
    document.getElementById("listar-professores").click(); // Atualiza a lista após editar
  } catch (err) {
    showMessage("Erro ao atualizar professor!", true);
    console.error(err);
  }
});

// EXCLUIR PROFESSOR
window.excluirProfessor = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este professor?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir professor!");
    await response.json();
    showMessage("Professor excluído com sucesso!");
    document.getElementById("listar-professores").click(); // Atualiza a lista após excluir
  } catch (err) {
    showMessage("Erro ao excluir professor!", true);
    console.error(err);
  }
};


