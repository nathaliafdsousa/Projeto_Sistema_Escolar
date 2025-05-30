const API_URL = "https://school-system-spi.onrender.com/api/turmas";

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

// CADASTRAR TURMA
document.getElementById("turma-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    materia: form.materia.value,
    descricao: form.descricao.value,
    professor_id: form.professor_id.value ? parseInt(form.professor_id.value) : null,
    ativo: form.ativo.value === "true"
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar turma!");
    await response.json();
    showMessage("Turma cadastrada com sucesso!");
    form.reset();
    document.getElementById("listar-turmas").click(); 
  } catch (err) {
    showMessage("Erro ao cadastrar turma!", true);
    console.error(err);
  }
});

// LISTAR TURMAS
document.getElementById("listar-turmas").addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar turmas!");
    const turmas = await res.json();

    const container = document.getElementById("turmas-lista");
    container.innerHTML =
      turmas
        .map(
          (t) => `
      <div>
        <strong>${t.materia}</strong> (ID: ${t.id})<br>
        Descrição: ${t.descricao || "-"}<br>
        Professor ID: ${t.professor_id ?? "-"}<br>
        Ativo: ${t.ativo ? "Sim" : "Não"}<br>
        <button onclick="editarTurma(${t.id})">Editar</button>
        <button onclick="excluirTurma(${t.id})">Excluir</button>
        <hr>
      </div>
    `
        )
        .join("") || "<div>Nenhuma turma cadastrada.</div>";
    showMessage("Lista de turmas carregada!");
  } catch (err) {
    showMessage("Erro ao listar turmas!", true);
    console.error(err);
  }
});

// EDITAR TURMA
window.editarTurma = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar turma!");
    const turma = await res.json();

    document.getElementById("editar-id").value = turma.id;
    document.getElementById("editar-materia").value = turma.materia;
    document.getElementById("editar-descricao").value = turma.descricao;
    document.getElementById("editar-professor_id").value = turma.professor_id;
    document.getElementById("editar-ativo").value = turma.ativo ? "true" : "false";

    showMessage("Turma carregada para edição!");
  } catch (err) {
    showMessage("Erro ao carregar turma!", true);
    console.error(err);
  }
};

// ATUALIZAR TURMA
document.getElementById("editar-form-turma").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const turmaId = document.getElementById("editar-id").value;
  const data = {
    materia: form["materia"].value,
    descricao: form["descricao"].value,
    professor_id: form["professor_id"].value ? parseInt(form["professor_id"].value) : null,
    ativo: form["ativo"].value === "true"
  };

  try {
    const response = await fetch(`${API_URL}/${turmaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar turma!");
    await response.json();
    showMessage("Turma atualizada com sucesso!");
    form.reset();
    document.getElementById("listar-turmas").click(); // Atualiza a lista após editar
  } catch (err) {
    showMessage("Erro ao atualizar turma!", true);
    console.error(err);
  }
});

// EXCLUIR TURMA
window.excluirTurma = async function(id) {
  if (!confirm("Tem certeza que deseja excluir esta turma?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir turma!");
    await response.json();
    showMessage("Turma excluída com sucesso!");
    document.getElementById("listar-turmas").click(); // Atualiza a lista após excluir
  } catch (err) {
    showMessage("Erro ao excluir turma!", true);
    console.error(err);
  }
};

