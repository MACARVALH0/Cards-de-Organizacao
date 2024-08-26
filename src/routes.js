// Rotas de chamadas para o servidor
const express = require('express');
const controller = require('./controllers.js');

const router = express.Router();

router.get('/decks/all', controller.getDeckList);
router.get('/decks', controller.setupDeckPage);
router.post('/checklist', controller.createChecklistItem);
router.put('/checklist', controller.markChecklistItem);
router.delete('/checklist', controller.deleteChecklistItem);
router.put('/main/bio', controller.updateDeckBio);
router.delete('/journal', controller.deleteJournalEntry);
// router.put('/journal/create', controller.createJournalEntry);

module.exports = router;