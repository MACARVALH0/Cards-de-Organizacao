function setupControllers(deckID)
{
    const deck_ID = deckID;

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
    var entryDeletePanelTimer;
    var last_entry_touched = undefined;

    new_item_input.addEventListener("focus", (e) => {e.target.value = "";});
    new_item_input.addEventListener("blur", (e) => {if(e.target.value == ""){e.target.value = task_placeholder_txt;}});


    // Retorna o índice da última tarefa em aberto ou da primeira fechada, de acordo com a ordem disposta na lista. 
    function getTaskIndex (opt, list, len)
    {
        if(opt){ for(let i = len-1; i > 0; i--){ if(!list[i].querySelector("input").checked){ return i }; } }
        else for(let i = 0; i < len; i++) if(list[i].querySelector("input").checked) return i;
    }


    
    function createTasklistItemDOMElement(id, title)
    {
        const new_item = document.createElement("div");
        new_item.classList.add("task");

        const checkbox_wrapper = document.createElement("div");
        checkbox_wrapper.classList.add("checkbox-wrapper");
        checkbox_wrapper.dataset.id = id;
        checkbox_wrapper.addEventListener("input", function (e){ toggleCheckTask(e) });

        const item_input = document.createElement("input");
        item_input.id = "task" + id;
        item_input.setAttribute("type", "checkbox");
        
        const item_label = document.createElement("label");
        item_label.htmlFor = item_input.id;
        item_label.innerHTML = title;

        const delete_btn = document.createElement("span");
        delete_btn.dataset.id = id;
        delete_btn.innerHTML = "&times;";
        delete_btn.classList.add("content-delete-btn");
        delete_btn.addEventListener("click", function(){deleteTask(this.parentElement, this.dataset.id)});

        checkbox_wrapper.append(item_input, item_label);
        new_item.append(checkbox_wrapper, delete_btn);


        let first_item = checklist_items.querySelectorAll(".task")[1]; // Segundo item;
        checklist_items.insertBefore(new_item, first_item);
    }

    function updateChecklistItemElementPosition(item, to_finish)
    {
        const item_parent = item.parentElement; // div #checklist-items
        const item_container = item_parent.querySelectorAll(".task");
        const item_list = [...item_container];
        const item_index = item_list.indexOf(item);
        const list_len = item_list.length;

        const timeout = 300;

        if (item_index === -1) return; // O item, por algum motivo, não foi encontrado na lista :shrug:

        if(to_finish)
        { // marcando
            if(item_index === list_len-1) return;  // Apenas retorna caso o item já esteja na última posição da lista.

            let next_item = item_list[item_index+1];
            if(next_item.querySelector("input").checked) return; // Retorna caso já esteja na área de tarefas concluídas.

            // Se torna primeiro nas concluídas
            setTimeout(() =>
            {
                let last_unchecked = getTaskIndex(1, item_list, list_len);
                item_parent.insertBefore(item, item_list[last_unchecked+1]);
            }, timeout)
        }

        else
        { // desmarcando
            if(item_list.indexOf(item) === 1) return; // Apenas retorna caso o item já esteja na primeira posição da lista.

            let previous_item = item_list[item_index-1];
            if(!previous_item.querySelector("input").checked) return; // Retorna caso já esteja na área de tarefas abertas.

            // Se torna último nas abertas
            setTimeout(() => 
            {
                let last_unchecked = getTaskIndex(0, item_list, list_len);
                item_parent.insertBefore(item, item_list[last_unchecked]);
            }, timeout);

        }
    }





    function taskDeleteCancel(last_element, current_element)
    {
        current_element.querySelector("label").innerHTML = last_element.original_txt;
        last_element.el = undefined;
    }


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


    function updateDeckBio(txt)
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



    async function showEntryDeletePanel(e)
    {
        e.stopPropagation();
        const delete_span = e.target;
        const journal_entry = delete_span.parentElement;
        
        const delete_panel_text = document.createElement('span');
        delete_panel_text.appendChild(document.createTextNode("Excluir esta entrada do diário?"));
        
        // `y` button HTML Object
        const yes_btn = document.createElement('span');
        yes_btn.classList.add('entry-delete-yn', 'entry-delete-y');
        yes_btn.innerHTML = 'y';
        yes_btn.addEventListener('click', e => deleteJournalEntry(e, journal_entry));
    
        // `n` button HTML Object
        const no_btn = document.createElement('span');
        no_btn.classList.add('entry-delete-yn', 'entry-delete-n');
        no_btn.innerHTML = 'n';

        delete_panel_text.appendChild(document.createTextNode(' ('));
        delete_panel_text.appendChild(yes_btn);
        delete_panel_text.appendChild(document.createTextNode('/'));
        delete_panel_text.appendChild(no_btn);
        delete_panel_text.appendChild(document.createTextNode(')'));



        
        // const delete_panel_text = "Tem certeza que deseja apagar <br>esta entrada no diário? (<span class=\"entry-delete-yn entry-delete-y\" onclick=\""+ function(){deleteJournalEntry(journal_entry)} +"\"> y </span>/<span class=\"entry-delete-yn entry-delete-n\"> n </span>)";
        // const delete_panel_text = "Tem certeza que deseja apagar <br>esta entrada no diário? ( "+yes_btn+"/<span class=\"entry-delete-yn entry-delete-n\"> n </span>)";


        if(last_entry_touched)
        {
            if(last_entry_touched != delete_span)
            {
                if(entryDeletePanelTimer){ clearTimeout(entryDeletePanelTimer); }

                last_entry_touched.innerHTML = "&times;";
                last_entry_touched = delete_span;
                last_entry_touched.innerHTML = '';
                last_entry_touched.appendChild(delete_panel_text);
    
                entryDeletePanelTimer = setTimeout( () =>
                {
                    last_entry_touched = undefined;
                    delete_span.innerHTML = "&times;";
                    clearTimeout(entryDeletePanelTimer);
                }, 3000);
            }
        }
        else
        {
            last_entry_touched = delete_span;
            last_entry_touched.innerHTML = '';
            last_entry_touched.appendChild(delete_panel_text);

            entryDeletePanelTimer = setTimeout( () =>
            {
                last_entry_touched = undefined;
                delete_span.innerHTML = "&times;";
                clearTimeout(entryDeletePanelTimer);
            }, 3000);
        }
    }


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



    return [createTask, toggleCheckTask, deleteTask, updateDeckBio, showEntryDeletePanel];
}
