// Dados dos laboratórios
const laboratorios = [
    { id: 1, nome: "Laboratório 01", capacidade: 30, disponivel: true },
    { id: 2, nome: "Laboratório 02", capacidade: 40, disponivel: false },
    { id: 3, nome: "Laboratório 03", capacidade: 25, disponivel: true }
];

// Armazenamento de reservas (em memória)
let reservas = [];

// Elementos do DOM
const labsContainer = document.getElementById('labs-container');
const labSelect = document.getElementById('laboratorio');
const reservationForm = document.getElementById('reservation-form');
const confirmationSection = document.getElementById('confirmation-section');
const confirmationContent = document.getElementById('confirmation-content');
const reservationsList = document.getElementById('reservations-list');
const messagesDiv = document.getElementById('validation-messages');
const tipoAtividadeSelect = document.getElementById('tipo-atividade');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarLaboratorios();
    carregarSelectLaboratorios();
    configurarEventos();
    
    // Definir data mínima como hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);
    
    // Fechar mensagens com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openMessages = document.querySelectorAll('.message');
            openMessages.forEach(msg => msg.remove());
            
            // Também fechar seção de confirmação
            const confirmation = document.getElementById('confirmation-section');
            if (confirmation && confirmation.style.display !== 'none') {
                confirmation.style.display = 'none';
            }
        }
    });
});

// Carregar laboratórios na interface
function carregarLaboratorios() {
    labsContainer.innerHTML = '';
    
    laboratorios.forEach(lab => {
        const card = criarCardLaboratorio(lab);
        labsContainer.appendChild(card);
    });
}

// Criar card de laboratório
function criarCardLaboratorio(lab) {
    const div = document.createElement('div');
    div.className = `lab-card ${lab.disponivel ? 'available' : 'unavailable'}`;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'lab-name';
    nameDiv.textContent = lab.nome;
    
    const capacityDiv = document.createElement('div');
    capacityDiv.className = 'lab-capacity';
    capacityDiv.textContent = `Capacidade: ${lab.capacidade} alunos`;
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `lab-status ${lab.disponivel ? 'available' : 'unavailable'}`;
    statusDiv.textContent = lab.disponivel ? 'Disponível' : 'Indisponível';
    
    // Indicar que lab 03 não serve para aulas regulares
    if (lab.capacidade < 30) {
        const restrictionNote = document.createElement('small');
        restrictionNote.style.color = '#e74c3c';
        restrictionNote.style.display = 'block';
        restrictionNote.style.marginTop = '5px';
        restrictionNote.textContent = 'Não disponível para aulas regulares';
        div.appendChild(restrictionNote);
    }
    
    div.appendChild(nameDiv);
    div.appendChild(capacityDiv);
    div.appendChild(statusDiv);
    
    return div;
}

// Carregar select de laboratórios
function carregarSelectLaboratorios() {
    labSelect.innerHTML = '<option value="">Selecione um laboratório</option>';
    
    laboratorios.forEach(lab => {
        const option = document.createElement('option');
        option.value = lab.id;
        option.textContent = lab.nome;
        option.disabled = !lab.disponivel;
        labSelect.appendChild(option);
    });
}

// Configurar eventos
function configurarEventos() {
    reservationForm.addEventListener('submit', validarReserva);
    tipoAtividadeSelect.addEventListener('change', atualizarTiposLaboratorio);
    
    // Botão de fechar confirmação
    document.getElementById('close-confirmation')?.addEventListener('click', function() {
        confirmationSection.style.display = 'none';
    });
}

// Atualizar opções de laboratório conforme tipo de atividade
function atualizarTiposLaboratorio() {
    const tipoTipo = tipoAtividadeSelect.value;
    
    labSelect.innerHTML = '<option value="">Selecione um laboratório</option>';
    
    laboratorios.forEach(lab => {
        const option = document.createElement('option');
        option.value = lab.id;
        option.textContent = lab.nome;
        
        // Se for aula regular, desativar labs com capacidade < 30
        if (tipoTipo === 'aula-regular' && lab.capacidade < 30) {
            option.disabled = true;
            option.textContent += ' (não disponível para aula regular)';
        } else if (!lab.disponivel) {
            option.disabled = true;
        }
        
        labSelect.appendChild(option);
    });
}

// Validar reserva
function validarReserva(event) {
    event.preventDefault();
    
    // Limpar mensagens anteriores
    limparMensagens();
    
    // Coletar dados do formulário
    const nome = document.getElementById('professor-nome').value.trim();
    const matricula = document.getElementById('professor-matricula').value.trim();
    const labSelectValue = labSelect.value;
    const labId = labSelectValue ? parseInt(labSelectValue) : null;
    const tipoTipo = tipoAtividadeSelect.value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const finalidade = document.getElementById('finalidade').value.trim();
    
    // Validações
    const erros = [];
    
    if (!nome) erros.push('O nome do professor é obrigatório.');
    if (!matricula) erros.push('A matrícula é obrigatória.');
    if (!labId) erros.push('Selecione um laboratório.');
    if (!tipoTipo) erros.push('Selecione o tipo de atividade.');
    if (!data) erros.push('A data é obrigatória.');
    if (!horario) erros.push('O horário é obrigatório.');
    if (!finalidade) erros.push('A finalidade é obrigatória.');
    
    // Validar data não passada
    const hoje = new Date().toISOString().split('T')[0];
    if (data && data < hoje) {
        erros.push('Não é possível reservar para uma data passada.');
    }
    
    // Se houver erros, mostrar
    if (erros.length > 0) {
        mostrarErros(erros);
        return;
    }
    
    // Validar laboratório
    const labSelecionado = laboratorios.find(l => l.id === labId);
    
    if (!labSelecionado.disponivel) {
        erros.push('Este laboratório não está disponível para reservas.');
        mostrarErros(erros);
        return;
    }
    
    // Validar capacidade para aula regular
    if (tipoTipo === 'aula-regular' && labSelecionado.capacidade < 30) {
        erros.push(`O ${labSelecionado.nome} não pode receber reservas para aulas regulares (capacidade mínima: 30 alunos).`);
        mostrarErros(erros);
        return;
    }
    
    // Validar conflito de horário
    const dataHorario = `${data}T${horario}`;
    const conflito = reservas.find(r => 
        r.laboratorioId === labId && 
        r.dataHora === dataHorario
    );
    
    if (conflito) {
        erros.push('Já existe uma reserva para este laboratório neste horário.');
        mostrarErros(erros);
        return;
    }
    
    // Criar reserva
    const novaReserva = {
        id: reservas.length + 1,
        professorNome: nome,
        professorMatricula: matricula,
        laboratorioId: labId,
        laboratorioNome: labSelecionado.nome,
        laboratorioCapacidade: labSelecionado.capacidade,
        tipoTipo: tipoTipo,
        data: data,
        horario: horario,
        dataHora: dataHorario,
        finalidade: finalidade
    };
    
    reservas.push(novaReserva);
    
    // Confirmar reserva
    confirmarReserva(novaReserva);
    
    // Limpar formulário
    reservationForm.reset();
    atualizarTiposLaboratorio();
    
    // Atualizar lista de reservas
    atualizarListaReservas();
}

// Mostrar erros de validação
function mostrarErros(erros) {
    erros.forEach(erro => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `
            ${erro}
            <button type="button" class="close-btn" onclick="this.parentElement.remove()">&times;</button>
        `;
        messagesDiv.appendChild(messageDiv);
    });
}

// Confirmar reserva
function confirmarReserva(reserva) {
    const tipoTipoTexto = reserva.tipoTipo === 'aula-regular' ? 'Aula Regular' : 'Outra Finalidade';
    
    confirmationContent.innerHTML = `
        <div class="confirmation-item">
            <span class="confirmation-label">Professor:</span>
            <span class="confirmation-value">${reserva.professorNome}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Matrícula:</span>
            <span class="confirmation-value">${reserva.professorMatricula}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Laboratório:</span>
            <span class="confirmation-value">${reserva.laboratorioNome}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Capacidade:</span>
            <span class="confirmation-value">${reserva.laboratorioCapacidade} alunos</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Data:</span>
            <span class="confirmation-value">${reserva.data}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Horário:</span>
            <span class="confirmation-value">${reserva.horario}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Tipo:</span>
            <span class="confirmation-value">${tipoTipoTexto}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Finalidade:</span>
            <span class="confirmation-value">${reserva.finalidade}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Status:</span>
            <span class="confirmation-value success">Reservado com sucesso</span>
        </div>
    `;
    
    confirmationSection.style.display = 'block';
    
    // Mostrar mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'message success';
    successDiv.innerHTML = `
        Reserva realizada com sucesso!
        <button type="button" class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    messagesDiv.appendChild(successDiv);
}

// Atualizar lista de reservas
function atualizarListaReservas() {
    reservationsList.innerHTML = '';
    
    if (reservas.length === 0) {
        reservationsList.innerHTML = '<p class="empty-state">Nenhuma reserva realizada.</p>';
        return;
    }
    
    reservas.slice().reverse().forEach(reserva => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'reservation-item';
        
        const tipoTipoTexto = reserva.tipoTipo === 'aula-regular' ? 'Aula Regular' : 'Outra Finalidade';
        
        itemDiv.innerHTML = `
            <div class="reservation-header">
                <span class="reservation-professor">${reserva.professorNome}</span>
                <span class="reservation-status active">Ministrando Aula</span>
            </div>
            <div class="reservation-details">
                <div class="reservation-detail">
                    <span class="label">Matrícula</span>
                    <span class="value">${reserva.professorMatricula}</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Laboratório</span>
                    <span class="value">${reserva.laboratorioNome}</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Capacidade</span>
                    <span class="value">${reserva.laboratorioCapacidade} alunos</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Data</span>
                    <span class="value">${reserva.data}</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Horário</span>
                    <span class="value">${reserva.horario}</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Tipo</span>
                    <span class="value">${tipoTipoTexto}</span>
                </div>
                <div class="reservation-detail">
                    <span class="label">Finalidade</span>
                    <span class="value">${reserva.finalidade}</span>
                </div>
            </div>
        `;
        
        reservationsList.appendChild(itemDiv);
    });
}

// Limpar mensagens
function limparMensagens() {
    messagesDiv.innerHTML = '';
}

// Função de teste para verificar conflito de horário
function verificarConflito(labId, data, horario) {
    const dataHora = `${data}T${horario}`;
    return reservas.some(r => 
        r.laboratorioId === labId && 
        r.dataHora === dataHora
    );
}

// Função para obter reservas por laboratório
function getReservasPorLaboratorio(labId, data, horario) {
    const dataHora = `${data}T${horario}`;
    return reservas.filter(r => 
        r.laboratorioId === labId && 
        r.dataHora === dataHora
    );
}