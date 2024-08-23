const db = require('./db');
const db_op = require('./db_operations');

exports.getDeckList = async (_, res) =>
{
    try
    {
        const result = await db_op.getDecks();
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};



exports.setupDeckPage = async (req, res) =>
{
    const deck_ID = req.query.deck_id;

    const promises = 
    [
        db_op.getDeckMainContent(deck_ID),
        db_op.getDeckChecklist(deck_ID),
        db_op.getDeckJournalEntries(deck_ID)
    ];

    const results = await Promise.all(promises);

    const [main, checklist, journal_entries] = results;

    if(journal_entries.length > 0)
    {
        const today = new Date();
        const last_entry_date = journal_entries[journal_entries.length - 1].creationDate;
        const formatted_date = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
        if(last_entry_date != formatted_date)
        {
            // FIXME -> Function to create a journal entry 
            const response = await db_op.createJournalEntry(deck_ID);
            const {status, id} = response;
            console.log(status);
            
            journal_entries.push
            ({
                ID: id,
                deckId: deck_ID,
                creationDate: formatted_date,
                title: "Sem título",
                content: "(vazio)"
            });
        }
    }
    else
    {
        // FIXME -> Function to create a journal entry 
        const response = await db_op.createJournalEntry(deck_ID);
        const {status, id} = response;
        console.log(status);
        
        journal_entries.push
        ({
            ID: id,
            deckId: deck_ID,
            creationDate: formatted_date,
            title: "Sem título",
            content: "(vazio)"
        });
    }

    journal_entries.forEach(x => x.creationDate = x.creationDate.split('-').reverse().join('/'));


    const deck = {main, checklist, journal_entries};
    res.render("deckPage", { deck });
};


exports.createChecklistItem = async (req, res) =>
{
    const { parent_ID, title: item_title } = req.body;

    try
    {
        const response = await db_op.createItem(parent_ID, item_title);
        console.log(response.status);
        res.json(response);
    }

    catch(err)
    {
        console.error(err);
        res.status(500).json({err});
    }
}



exports.deleteChecklistItem = async (req, res) =>
{
    const item_ID = req.body.id;
    console.log("ID do item:", item_ID);
    

    try 
    {
        const delete_status = await db_op.deleteItem(item_ID);
        console.log("Item deletado.");
        res.json({delete_status})
    }

    catch(err)
    {
        console.error(err);
        res.status(500).json({err});
    }
}



exports.markChecklistItem = async (req, res) =>
{
    const {id, checked} = req.body;

    try
    {
        const status = await db_op.checkItem(id, checked);
        res.json({status});
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({err});
    }
}



exports.updateDeckBio = async (req, res) =>
{
    const { id, bioText: text } = req.body;
    
    try
    {
        const status = await db_op.updateBio(text, id);
        console.log(status);
        res.json({status});
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({err});
    }
}



exports.deleteJournalEntry = async (req, res) =>
{
    const id = req.body.id;

    try
    {
        const result = await db_op.deleteJournalEntryOp(id);
        console.log(result);
        res.json({status: result})
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({err});
    }
}