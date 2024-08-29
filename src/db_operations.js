const db = require('./db')


function getDecks()
{
    const query = "SELECT * FROM Decks";
    return new Promise((resolve, reject) =>
    {
        db.all(query, (err, decks) =>
        {
            if(err) reject("Não foi possível encontrar os decks no servidor.");
            else resolve(decks);
        });
    });
}



function getDeckMainContent(deck_ID)
{
    const query = "SELECT * FROM Decks WHERE ID = ?";
    return new Promise((resolve, reject) =>
    {
        db.get(query, deck_ID, (err, content) =>
        {
            if(err) reject("Erro interno do servidor: Não foi possível captar o `Main Content` do deck.");
            else resolve(content);
        });
    });
}



function getDeckChecklist(deck_ID)
{
    const query = "SELECT * FROM ChecklistItems WHERE deckID = ?";
    return new Promise((resolve,reject) =>
    {
        db.all(query, deck_ID, (err, content) =>
        {
            if(err) reject("Erro interno do servidor: Não foi possível captar os itens da checklist do deck.");
            else resolve(content);
        });
    })
}



function getDeckJournalEntries(deck_ID)
{
    const query = "SELECT * FROM JournalEntries WHERE deckID = ?";
    return new Promise((resolve,reject) =>
    {
        db.all(query, deck_ID, (err, content) =>
        {
            if(err) reject("Erro interno do servidor: Não foi possível captar os itens da checklist do deck.");
            else resolve(content);
        });
    })
}



function createItem(parent_ID, title)
{
    const query = "INSERT INTO ChecklistItems (deckID, title) VALUES (?, ?)";

    return new Promise((resolve, reject) =>
    {
        db.run(query, [parent_ID, title], function(err)
        {
            if(err) reject("Não foi possível criar um novo item.\n" + err.message);
            
            else resolve({status:"O novo item foi inserido com sucesso na tabela.", id: this.lastID});
        });
    })
}


function checkItem(id, checked)
{

    const query = "UPDATE ChecklistItems SET finished = ? WHERE ID = ?";

    return new Promise((resolve, reject) =>
    {
        db.run(query, [checked, id], (err) =>
        {
            if(err) reject("Houve um erro ao interagir com o banco.\n"+err);
            else resolve("A situação do item foi atualizada.");
        })
    });
}


function deleteItem(id)
{
    const query = "DELETE FROM ChecklistItems WHERE ID = ?";
    return new Promise((resolve, reject) =>
    {
        db.run(query, id, (err) =>
        {
            if(err) reject(err);
            else resolve("O item foi deletado com sucesso.");
        })
    })
}





function updateBio(txt, id)
{
    const query = "UPDATE Decks SET mainContent = ? WHERE ID = ?";
    return new Promise((resolve, reject) =>
    {
        db.run(query, [txt, id], (err) =>
        {
            if(err) reject("Não foi possível salvar as alterações na bio do deck.\n"+err);
            else resolve("A bio foi atualizada sem complicações.");
        });
    });
}



function createJournalEntry(deckId)
{
    const query = "INSERT INTO JournalEntries (deckId) VALUES (?)";
    return new Promise((resolve, reject) =>
    {
        db.run(query, deckId, function (err)
        {
            if(err) reject("Não foi possível adicionar uma nova entrada ao diário.\n"+err);
            else resolve({status:"A entrada do dia foi adicionada ao diário.", id: this.lastID});
        })
    });
}


function writeJournalEntryContent(journal_id, content)
{
    const query = "UPDATE JournalEntries SET content = ? WHERE ID = ?";
    return new Promise((resolve, reject) =>
    {
        db.run(query, [content, journal_id], (err) =>
        {
            if(err){ reject("Não foi posssível atualzar o conteúdo da entrada do diário."); }
            else{ resolve("O conteúdo da entrada foi atualizado com sucesso."); }
        });
    });
    
}

function deleteJournalEntryOp(entry_id)
{
    const query = "DELETE FROM JournalEntries WHERE ID = ?";

    return new Promise((resolve, reject) =>
    {
        db.run(query, entry_id, function (err)
        {
            if(err) reject("Não foi possível completar a operação de deletar a entrada do diário.");
            else resolve("A entrada de Id "+entry_id+" no diário foi deletada com sucesso.");
        });
    })

}


module.exports =
{
    getDecks,
    getDeckMainContent,
    getDeckChecklist,
    getDeckJournalEntries,
    createItem,
    deleteItem,
    checkItem,
    updateBio,
    createJournalEntry,
    deleteJournalEntryOp
}