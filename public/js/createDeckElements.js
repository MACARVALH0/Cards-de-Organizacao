function createDeckElements(decks = [])
{
    // 1. Cria a carta inicial, responsável por criar um novo deck
    let initial_deck_div = document.createElement("div");
    initial_deck_div.classList.add("deck-div");
    initial_deck_div.setAttribute('data-ID', 0);

    let initial_deck_title = document.createElement("p");
    initial_deck_title.innerHTML = "Novo Deck";

    initial_deck_div.appendChild(initial_deck_title);
    HTML_deck_body.appendChild(initial_deck_div);

    setPageChangeEvent(initial_deck_div, 0);

    for(let deck of decks)
    {
        // 1. Cria os elementos no DOM e os insere no corpo do HTML
        let deck_div = document.createElement("div");
        deck_div.classList.add("deck-div");
        deck_div.setAttribute('data-ID', deck.ID);

        let deck_title = document.createElement("p");
        deck_title.innerHTML = deck.title;

        deck_div.appendChild(deck_title);
        
        HTML_deck_body.appendChild(deck_div);


        // 2. Aplica um listener de eventos para mudança de página em cada elemento de deck
        setPageChangeEvent(deck_div, deck.ID);
    }
}

function setPageChangeEvent(element, id)
{
    element.addEventListener("click", (e)=>
    {
        e.stopPropagation();
        enterDeck(id);
    });
}