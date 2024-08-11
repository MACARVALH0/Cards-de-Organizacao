function setupPage(deckID)
{
    const deck_ID = deckID;
    const update_delay = 2000;
    var bioUpdateTimeout = null;

    const checklist_DOM = document.querySelector("#checklist");
    const checklist_items = checklist_DOM.querySelector("#checklist-items");

    const checklist_new_item = checklist_items.querySelector(".task");
    const new_item_input = checklist_new_item.querySelector("input");

    const bio_DOM = document.querySelector("#bio");
    const journal_DOM = document.querySelector("#journal");
    const task_placeholder_txt = new_item_input.value; // Primeira task

    new_item_input.addEventListener("focus", (e) => {e.target.value = "";});
    new_item_input.addEventListener("blur", (e) => {if(e.target.value == ""){e.target.value = task_placeholder_txt;}});

    function lTaskDeleteCancel(last_element, current_element)
    {
        getLabel(current_element).innerHTML = last_element.original_txt;
        last_element.el = undefined;
    }

    function getLabel(el){return el.querySelector("label")};
    
    const getTaskIndex = (opt, list, len) =>
    { // Retorna o índice da última tarefa em aberto ou da primeira fechada, de acordo com a ordem disposta na lista. 
        if(opt){for(let i = len-1; i > 0; i--) if(!list[i].querySelector("input").checked) return i;}

        else for(let i = 0; i < len; i++) if(list[i].querySelector("input").checked) return i;
    }


    async function toggleCheckTask(e)
    {
        //TODO Definir o ID do item no div
        const div = e.target.parentElement;
        const is_checked = e.target.checked ? 1 : 0;
        const input = div.firstElementChild;
        const label = div.lastElementChild;
        
        try
        {
            const route = '/api/checklist/check';

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
    
    // TODO
    // Adicionar event listener de input
    // Adicionar dataset-id com o ID do item
    function createTasklistItemDOMElement(id, title)
    {
        const new_item = document.createElement("div");
        new_item.classList.add("task");

        const wrapper_div = document.createElement("div");
        wrapper_div.classList.add("checkbox-wrapper");

        const item_input = document.createElement("input");
        item_input.id = "task" + id;
        item_input.setAttribute("type", "checkbox");
        
        const item_label = document.createElement("label");
        item_label.htmlFor = item_input.id;
        item_label.innerHTML = title;

        const delete_btn = document.createElement("span");

        wrapper_div.append(item_input, item_label);
        new_item.append(wrapper_div, delete_btn);


        let first_item = checklist_items.querySelectorAll(".task")[1]; // Segundo item;
        checklist_items.insertBefore(new_item, first_item);
    }


    async function createTask(event, title)
    {
        event.preventDefault();
        
        if(typeof(title) != 'string') throw new Error("Não é possível adicionar este título.");

        try
        {
            const route = 'checklist/create';
            const creation_status = await fetch(route,
            {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({parent_ID: deck_ID, title})
            });

            if(!creation_status.ok)
            {
                throw new Error("Houve um erro ao adicionar o item na lista.");
            }

            const result = await creation_status.json();
            console.log(result.status);

            createTasklistItemDOMElement(result.id, title);
        }

        catch(err) {console.error("Não foi possível adicionar o elemento HTML do item à checklist.\n", err);}


    }



    var last_task_touched = {el:undefined, original_txt:""};
    async function deleteTask(el, id)
    {
        let cancel_timer;

        if(last_task_touched.el)
        {
            if(el == last_task_touched.el && last_task_touched.el)
            {
                // Leva para o controlador de exclusão

                try
                {
                    const route = 'checklist/delete';
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

            else lTaskDeleteCancel(el, last_task_touched);

        }
        else
        {
            last_task_touched.el = el;
            last_task_touched.original_txt = getLabel(el).innerHTML;
            getLabel(el).innerHTML = "Deletar tarefa?";

            cancel_timer = setTimeout(()=>{lTaskDeleteCancel(last_task_touched, el)}, 3000)
        }
    }



    function updateDeckBio(txt)
    {
        if(bioUpdateTimeout) clearTimeout(bioUpdateTimeout);

        bioUpdateTimeout = setTimeout( async () =>
        {
            const route = '/api/main/update';

            try
            {
                const status = await fetch(route, 
                {
                    method: 'PUT',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({id: deck_ID, bioText: txt})
                });

                if(!status.ok) throw new Error("Não foi possível atualizar os dados da Bio.");

                const result = await status.json();
                console.log(result.status);
            }

            catch(err) {console.error(err);}

        }, update_delay);
    }
}