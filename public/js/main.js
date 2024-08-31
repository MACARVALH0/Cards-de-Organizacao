const HTML_deck_body = document.querySelector("#deck-body");

window.addEventListener("load", async () =>
{
    const decks = await getDecks();
    console.log(decks);
    createDeckElements(decks);
});