# Sistema de Reserva de Laboratórios

Protótipo web desenvolvido como atividade prática da disciplina **Maturidade em Desenvolvimento de Software**, da **UNINASSAU**. A proposta é permitir que professores consultem os laboratórios da instituição e registrem reservas para suas atividades.

## Integrantes

| Nome | Matrícula |
|---|---|
| Jhoão Lucas | 01848181 |
| Matheus Henrique Costa| 01807287 |
| Mario Adriano | A preencher |
| Thomas Victor | 01613686 |

## Sobre o projeto

O sistema foi elaborado a partir dos diagramas UML e dos requisitos apresentados na atividade. A aplicação funciona no navegador e demonstra o fluxo de consulta de laboratórios, preenchimento de uma solicitação, validação e confirmação da reserva.

O projeto é um protótipo acadêmico de **Front-End**. Não utiliza banco de dados, backend ou autenticação real. As reservas ficam armazenadas em memória durante a execução da página e não são mantidas depois que ela é recarregada.

## Funcionalidades

- Consultar os laboratórios, suas capacidades e situações de disponibilidade.
- Preencher uma reserva com os dados do professor, laboratório, tipo de atividade, data, horário e finalidade.
- Validar os campos obrigatórios e impedir reservas em datas anteriores.
- Verificar a disponibilidade do laboratório e conflitos para o mesmo laboratório, data e horário.
- Aplicar a regra de capacidade mínima de 30 lugares para aulas regulares.
- Exibir uma confirmação após uma reserva válida.
- Consultar a lista de reservas realizadas durante a execução da página.

## Laboratórios do protótipo

| Laboratório | Capacidade | Situação inicial |
|---|---:|---|
| Laboratório 01 | 30 alunos | Disponível |
| Laboratório 02 | 40 alunos | Indisponível |
| Laboratório 03 | 25 alunos | Disponível |

**Regra adicional:** laboratórios com capacidade inferior a 30 alunos não podem ser reservados para aulas regulares. Assim, o Laboratório 03 não pode ser selecionado para esse tipo de atividade. A regra considera capacidade inferior a 30, portanto um laboratório com exatamente 30 lugares atende ao critério de capacidade.

## Tecnologias utilizadas

- **HTML5** — estrutura da página.
- **CSS3** — apresentação visual e responsividade.
- **JavaScript** — interação, validações e gerenciamento das reservas durante a execução.

## Como executar

1. Faça o download ou clone este repositório.
2. Mantenha os arquivos `index.html`, `style.css` e `script.js` na mesma pasta.
3. Abra o arquivo `index.html` em um navegador atualizado.

Não é necessário instalar dependências ou configurar um servidor para executar o protótipo localmente.

## Acesso ao projeto

- **Repositório:** [Sistema de Reserva de Laboratórios no GitHub](https://github.com/jhoaolucas04-dot/Sistema-de-laborat-rio-Maturidade-de-software-)
- **GitHub Pages:** Adicionar link do Github Pages aqui

## Disciplina

**Maturidade em Desenvolvimento de Software**  
UNINASSAU — Professor Rafael Pacheco Ferreira