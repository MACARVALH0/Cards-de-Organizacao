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

var last_entry_touched = undefined;
function showEntryDeletePanel(e)
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
            }, 2000);
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


function showJournalEntryModal(entry)
{
    console.log(`Click no diário ${Array.from(journal_entries).indexOf(entry)}.`);

    if(journal_modal.style.display != "block")
    {
        journal_modal.style.display = "block";

        window.requestAnimationFrame(()=>
        {
            journal_modal.style.width = "45vw";
            journal_modal.style.height = window.innerHeight * 0.9;
        });
    }

    else { return; }
}

function hideJournalEntryModal()
{
    requestAnimationFrame(()=>
    {
        journal_modal.style.width = "0px";
        setTimeout(()=>
        {
            journal_modal.style.display = "none";
        }, 500);
    });
}


var last_entry_id = null;
function setupJournalEntryModal(e)
{
    e.stopPropagation();

    const target = e.target;
    const element = target.closest(".journal-min-entry");

    const cur_id = element.dataset.id;
    if(cur_id != last_entry_id)
    {
        last_entry_element = element;
        last_entry_id = cur_id;
        console.log("O id do item é", cur_id);
    
        const title = element.querySelector(".journal-min-entry-title").innerHTML;
        const content = element.querySelector(".journal-min-entry-content").innerHTML;
        
        journal_modal_box.dataset.current_id = cur_id;
        journal_modal_title.value = title;
        journal_modal_body.value = content;
    }

    showJournalEntryModal(element);
}

function updateEntryMinContent(text, element, isMain)
{
    const trim_text = text.trim()
    if(isMain)
    {
        element.querySelector(".journal-min-entry-content").innerHTML
        =  trim_text == "" ? "(vazio)" : trim_text;
    }
    else
    {
        element.querySelector(".journal-min-entry-title").innerHTML
        = trim_text == "" ? "Sem título" : trim_text;
    }
}