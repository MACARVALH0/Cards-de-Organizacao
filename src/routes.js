// Rotas de chamadas para o servidor
const express = require('express');
const controller = require('./controllers.js');

const router = express.Router();

router.get('/decks/all', controller.getDeckList);
router.get('/decks', controller.setupDeckPage);
router.post('/checklist/create', controller.createChecklistItem);
router.delete('/checklist/delete', controller.deleteChecklistItem);
router.put('/checklist/check', controller.markChecklistItem);
router.put('/main/update', controller.updateDeckBio);
router.delete('/journal/delete', controller.deleteJournalEntry);
// router.put('/journal/create', controller.createJournalEntry);

module.exports = router;