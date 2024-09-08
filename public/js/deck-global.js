const checklist_DOM = document.querySelector("#checklist");
const checklist_items = checklist_DOM.querySelector("#checklist-items");

const checklist_new_item = checklist_items.querySelector(".task");
const new_item_input = checklist_new_item.querySelector("input");
const task_placeholder_txt = new_item_input.value;

const bio_DOM = document.querySelector("#bio");
const bio_update_delay = 1000;

const journal_DOM = document.querySelector("#journal");
const journal_entries = document.querySelectorAll(".journal-min-entry");
const journal_modal = document.querySelector("#journal-modal");
const journal_modal_box = journal_modal.querySelector("#journal-modal-box");
const journal_modal_title = journal_modal_box.querySelector("#journal-modal-title textarea");
const journal_modal_body = journal_modal_box.querySelector("#journal-modal-body textarea");
