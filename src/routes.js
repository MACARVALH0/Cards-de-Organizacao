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
router.post('/journal', controller.createJournalEntry);
router.delete('/journal', controller.deleteJournalEntry);
router.put('/journal', controller.updateJournalEntry);


module.exports = router;