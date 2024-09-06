new_item_input.addEventListener("focus", e => { e.target.value = ""; });
new_item_input.addEventListener("blur",  e => { if(e.target.value == "") { e.target.value = task_placeholder_txt; } });

for(let entry of journal_entries)
{
    entry.addEventListener("click", e =>
    {
        console.log(`Click no diário ${Array.from(journal_entries).indexOf(entry)}.`);

        if(journal_modal.style.display != "block")
        {
            // First changes
            journal_modal.style.display = "block";

            window.requestAnimationFrame(()=>
            {
                // What happens post first changes

                journal_modal.style.width = "45vw";
                journal_modal.style.height = window.innerHeight * 0.9;

            });
        }

        else { return; }

        
    });
}
