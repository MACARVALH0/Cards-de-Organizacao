# Cards de Organização
Exemplo do uso de uma API simples que permite o controle de cartões com dados de checklist, um espaço em branco e diários com datas.
<br>

## Introdução
A aplicação conta com uma interface gráfica para correlação entre os dados salvos e sua visualização ao usuário.
Cada deck, conforme apresentado inicialmente na execução do aplicativo contém três cards:
- Uma checklist de tarefas do usuário;
- Um espaço de "biografia", que permite uma definição mais descritiva de seu uso. a escrita de informações não correlatas, uma agenda, etc;
- Um espaço de diário que permite ao usuário, de acordo com o dia, anotar seus pensamentos e ideias.

## Guia de uso
### Do aplicativo:
#### Ferramentas necessárias:
1. Node.js;
2. NPM.

#### Passo a passo:
1. `npm install`, para instalar as dependências na sua máquina;
2. `node src/app`, para iniciar o servidor local;
3. Abrir o navegador no endereço `http://localhost:3000/`.
---
### Da API
#### Endpoints:
<table>
    <thead>
        <tr>
            <th>Rota</th>
            <th>Método</th>
            <th>Explicação</th>
            <th>Corpo da Solicitação</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>/decks/all</strong></td>
            <td><em>GET</em></td>
            <td>Retorna todos os decks disponíveis.</td>
            <td></td>
        </tr>
        <tr>
            <td><strong>/decks</strong></td>
            <td><em>GET</em></td>
            <td>Retorna o conteúdo de um deck específico.</td>
            <td></td>
        </tr>
        <tr>
            <td rowspan="4"><strong>/checklist</strong></td>
            <td><em>GET</em></td>
            <td>Retorna os itens da checklist de um deck.</td>
            <td></td>
        </tr>
        <tr>
            <td><em>POST</em></td>
            <td>Rota para criar um novo item na checklist.</td>
            <td>
                <ul>
                    <li><code>deck_ID</code>: <i>Integer.</i> O código de ID do deck em questão.</li>
                    <li><code>item_title</code>: <i>String.</i> O título do item a ser adicionado na checklist.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><em>PUT</em></td>
            <td>Rota para marcar/desmarcar um item da checklist como concluído.</td>
            <td>
                <ul>
                    <li><code>id</code>: <i>Integer.</i> Código de ID do item.</li>
                    <li><code>checked</code>: <i>Boolean.</i> <code>true</code> para marcar o item e <code>false</code> para desmarcar o item.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><em>DELETE</em></td>
            <td>Rota para deletar um item da checklist.</td>
            <td>
                <ul>
                    <li><code>id</code>: <i>Integer.</i> Código de ID do item.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><strong>/main/bio</strong></td>
            <td><em>PUT</em></td>
            <td>Rota para atualizar o conteúdo da bio do deck.</td>
            <td>
                <ul>
                    <li><code>id</code>: <i>Integer.</i> O código de ID do deck em questão.</li>
                    <li><code>text</code>: <i>String.</i> O conteúdo do espaço livre de texto.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><strong>/journal</strong></td>
            <td><em>DELETE</em></td>
            <td>Rota para deletar uma entrada no diário.</td>
            <td>
                <ul>
                    <li><code>id</code>: <i>Integer.</i> Código de ID da entrada do diário.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


Em construção.