new_item_input.addEventListener("focus", e => { e.target.value = ""; });
new_item_input.addEventListener("blur",  e => { if(e.target.value == "") { e.target.value = task_placeholder_txt; } });

// for(let entry of journal_entries)
// {entry.addEventListener("click", () => showJournalEntryModal(entry));}

