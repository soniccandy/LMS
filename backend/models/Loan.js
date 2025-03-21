const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    loanDate: { type: Date, required: true },
    returned: { type: Boolean, default: false },
});

module.exports = mongoose.model('Loan', loanSchema);
