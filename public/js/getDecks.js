async function getDecks()
{
    console.log("Buscando decks existentes.");
    try
    {
        const response = await fetch('/api/decks/all');

        if(!response.ok)
        {
            console.error("Não foi possível encontrar os dados dos decks.");
            return null;
        }

        return await response.json();
    }

    catch(err)
    {
        console.error("Não foi possível encontrar os decks.");
        return null;
    }
}