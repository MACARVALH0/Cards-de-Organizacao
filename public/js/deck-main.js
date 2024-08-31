const checklist_DOM = document.querySelector("#checklist");
const checklist_items = checklist_DOM.querySelector("#checklist-items");

const checklist_new_item = checklist_items.querySelector(".task");
const new_item_input = checklist_new_item.querySelector("input");
const task_placeholder_txt = new_item_input.value; // Primeira task
var last_task_touched = {el:undefined, original_txt:""};

const bio_DOM = document.querySelector("#bio");
const bio_update_delay = 1000;
var bioUpdateTimeout = null;

const journal_DOM = document.querySelector("#journal");
const journal_entries = document.querySelectorAll(".journal-min-entry");
const journal_entry_modal = createJournalEntryModal();


var entryDeletePanelTimer;
var last_entry_touched = undefined;

new_item_input.addEventListener("focus", (e) => {e.target.value = "";});
new_item_input.addEventListener("blur", (e) => {if(e.target.value == ""){e.target.value = task_placeholder_txt;}});

for(let entry of journal_entries)
{
    entry.addEventListener("click", e =>
    {
        journal_entry_modal.style.display = "block";

    });
}

function createJournalEntryModal()
{
    const main = document.createElement("div");
    main.c

}