new_item_input.addEventListener("focus", e => { e.target.value = ""; });
new_item_input.addEventListener("blur",  e => { if(e.target.value == "") { e.target.value = task_placeholder_txt; } });

journal_modal_title.addEventListener("input", (e) => updateJournalEntry(e, 0, last_entry_element));
journal_modal_body.addEventListener("input", (e) => updateJournalEntry(e, 1, last_entry_element));
