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
router.put('/journal/create', controller.createJournalEntry);
// router.put('/journal/delete', controller.deleteJournalEntry);

module.exports = router;