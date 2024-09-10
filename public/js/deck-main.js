new_item_input.addEventListener("focus", e => { e.target.value = ""; });
new_item_input.addEventListener("blur",  e => { if(e.target.value == "") { e.target.value = task_placeholder_txt; } });

journal_modal_title.addEventListener("input", (e) => updateJournalEntry(e, 0, last_entry_element));
journal_modal_body.addEventListener("input", (e) => updateJournalEntry(e, 1, last_entry_element));

journal_modal_entry_delete_btn.addEventListener("click", () =>
{
    const original_txt = journal_modal_title.value;
    journal_modal_title.value = "Excluir esta entrada do diário?";
    
    const temp_listener = e =>
    {
        hideJournalEntryModal();
        deleteJournalEntry(e, last_entry_element);
        journal_modal_title = "";
        journal_modal_content = "";
    }

    journal_modal_entry_delete_btn.addEventListener("click", temp_listener);

    setTimeout(() =>
    {
        journal_modal_entry_delete_btn.removeEventListener("click", temp_listener);
        journal_modal_title.value = original_txt;
    }, 2000);
    ;

});
