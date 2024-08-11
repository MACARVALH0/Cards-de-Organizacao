async function enterDeck(id)
{
    const route = `api/decks?deck_id=${id}`


    try  {window.location.href = route;}

    catch(err)
    {
        console.error("Não foi possível preparar a página do deck solicidado.\nErro: ", err);
        return;
    }

}
