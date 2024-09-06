function setupControllers(deckID)
{
    const deck_ID = deckID;
    

    async function createTask(event, title)
    {
        event.preventDefault();
        
        if(typeof(title) != 'string') throw new Error("Não é possível adicionar este título.");

        try
        {
            const route = '/api/checklist';
            const creation_status = await fetch(route,
            {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({deck_ID, title})
            });

            if(!creation_status.ok)
            {
                throw new Error("Houve um erro ao adicionar o item na lista.");
            }

            const result = await creation_status.json();
            console.log(result.status);

            createTasklistItemDOMElement(result.id, title);
            event.target.querySelector("input").value = "";
        }

        catch(err) {console.error("Não foi possível adicionar o elemento HTML do item à checklist.\n", err);}
    }


    async function toggleCheckTask(e)
    {
        console.log(e);
        const div = e.target.parentElement;
        const is_checked = e.target.checked ? 1 : 0;
        
        try
        {
            const route = '/api/checklist';

            const status = await fetch(route,
            {
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({id: div.dataset.id, checked: is_checked})
            })

            if(!status.ok) throw new Error("Não foi possível atualizar o item corretamente.");

            updateChecklistItemElementPosition(div.parentElement, is_checked)
        }

        catch(err){ console.error(err); }
    }


    var last_task_touched = {el:undefined, original_txt:""};
    async function deleteTask(el, id)
    {
        if(last_task_touched.el)
        {
            if(el == last_task_touched.el)
            {
                // Leva para o controlador de exclusão
                try
                {
                    const route = '/api/checklist';
                    const delete_status = await fetch(route,
                    {
                        method: "DELETE",
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({id})
                    });

                    if(!delete_status.ok)
                    {
                        throw new Error("Houve um erro ao deletar o item da lista.");
                    }

                    const result = await delete_status.json();
                    console.log(result.delete_status);

                    last_task_touched.el  = undefined;

                    el.remove();
                }

                catch(err)
                {
                    console.error(err);
                }

            }

            else taskDeleteCancel(el, last_task_touched);

        }
        else
        {
            const label = el.querySelector("label");
            last_task_touched.el = el;
            last_task_touched.original_txt = label.innerHTML;
            label.innerHTML = "Deletar tarefa?";

            setTimeout(()=>{taskDeleteCancel(last_task_touched, el)}, 2000);
        }
    }


    var bioUpdateTimeout = null;
    async function updateDeckBio(txt)
    {
        if(bioUpdateTimeout){ clearTimeout(bioUpdateTimeout); }

        bioUpdateTimeout = setTimeout( async () =>
        {
            const route = '/api/main/bio';

            try
            {
                const status = await fetch(route, 
                {
                    method: 'PUT',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({id: deck_ID, bioText: txt})
                });

                if(!status.ok) throw new Error("Não foi possível atualizar os dados da Bio.");

            }

            catch(err) {console.error(err);}

        }, bio_update_delay);
    }


    var entryDeletePanelTimer;
    var last_entry_touched = undefined;
    async function deleteJournalEntry(event, entry_element)
    {
        event.stopPropagation();

        const entry = entry_element;
        const id = entry.dataset.id;
        const route = '/api/journal';

        try
        {
            const status = await fetch(route,
            {
                method: "DELETE",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({id})
            })

            if(!status.ok){ throw new Error("Houve um erro ao deletar a entrada de Id "+id+" no diário."); }

            // const result = await status.json();
            // console.log(result.status);

            entry_element.remove();
            last_entry_touched = undefined;
        }
        
        catch (err){ console.error(err); }
    }


    return [createTask, toggleCheckTask, deleteTask, updateDeckBio, deleteJournalEntry];
}
