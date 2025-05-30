const API_URL = "https://school-system-spi.onrender.com/api/alunos";

// Função para mostrar mensagens
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

// Cadastro de aluno com atualização automática da lista
document.getElementById("aluno-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.nome.value,
    data_nascimento: form.data_nascimento.value,
    nota_primeiro_semestre: parseFloat(form.nota_primeiro_semestre.value),
    nota_segundo_semestre: parseFloat(form.nota_segundo_semestre.value),
    turma_id: parseInt(form.turma_id.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar aluno!");
    await response.json();
    showMessage("Aluno cadastrado com sucesso!");
    form.reset();
    document.getElementById("listar-alunos").click(); // Atualiza a lista automaticamente
  } catch (err) {
    showMessage("Erro ao cadastrar aluno!", true);
    console.error(err);
  }
});

// Listar alunos
document.getElementById("listar-alunos").addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar alunos!");
    const alunos = await res.json();

    const container = document.getElementById("alunos-lista");
    container.innerHTML =
      alunos
        .map(
          (a) => `
      <div>
        <strong>${a.nome}</strong> (ID: ${a.id})<br>
        Idade: ${a.idade ?? "-"} | Média: ${a.media_final ?? "-"}<br>
        Nascimento: ${a.data_nascimento} | Turma: ${a.turma_id}<br>
        <button onclick="editarAluno(${a.id})">Editar</button>
        <button onclick="excluirAluno(${a.id})">Excluir</button>
        <hr>
      </div>
    `
        )
        .join("") || "<div>Nenhum aluno cadastrado.</div>";
    showMessage("Lista de alunos carregada!");
  } catch (err) {
    showMessage("Erro ao listar alunos!", true);
    console.error(err);
  }
});

// Função para excluir aluno
window.excluirAluno = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir aluno!");
    await response.json();
    showMessage("Aluno excluído com sucesso!");
    document.getElementById("listar-alunos").click(); // Atualiza a lista após excluir
  } catch (err) {
    showMessage("Erro ao excluir aluno!", true);
    console.error(err);
  }
};

// Função para preencher o formulário de edição
window.editarAluno = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar aluno!");
    const aluno = await res.json();

    document.getElementById("editar-id").value = aluno.aluno.id;
    document.getElementById("editar-nome").value = aluno.aluno.nome;
    document.getElementById("editar-data_nascimento").value = aluno.aluno.data_nascimento;
    document.getElementById("editar-nota_primeiro_semestre").value = aluno.aluno.nota_primeiro_semestre;
    document.getElementById("editar-nota_segundo_semestre").value = aluno.aluno.nota_segundo_semestre;
    document.getElementById("editar-turma_id").value = aluno.aluno.turma_id;
    showMessage("Aluno carregado para edição!");
  } catch (err) {
    showMessage("Erro ao carregar aluno!", true);
    console.error(err);
  }
};

// Atualizar aluno
document.getElementById("editar-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const alunoId = document.getElementById("editar-id").value;
  const data = {
    nome: form["nome"].value,
    data_nascimento: form["data_nascimento"].value,
    nota_primeiro_semestre: parseFloat(form["nota_primeiro_semestre"].value),
    nota_segundo_semestre: parseFloat(form["nota_segundo_semestre"].value),
    turma_id: parseInt(form["turma_id"].value),
  };

  try {
    const response = await fetch(`${API_URL}/${alunoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar aluno!");
    await response.json();
    showMessage("Aluno atualizado com sucesso!");
    form.reset();
    document.getElementById("listar-alunos").click(); // Atualiza a lista após editar
  } catch (err) {
    showMessage("Erro ao atualizar aluno!", true);
    console.error(err);
  }
});

