// get loan (read)
const Loan = require('../models/Loan.js');

const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('book', 'title author')
            .populate('member', 'firstName lastName');
        res.json(loans);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// add loan
const addLoan = async (req, res) => {
    const { book, member, loanDate, returned } = req.body;
    try {
        const loan = await Loan.create({ 
            book, 
            member, 
            loanDate, 
            returned: returned === 'true'
        });
        // return populated data 
        const populatedLoan = await Loan.findById(loan._id)
            .populate('book', 'title author')
            .populate('member', 'firstName lastName');
        res.status(201).json(populatedLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update loan
const updateLoan = async (req, res) => {
    const { book, member, loanDate, returned } = req.body;
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found!'});
        
        loan.book = book || loan.book;
        loan.member = member || loan.member;
        loan.loanDate = loanDate || loan.loanDate;
        loan.returned = returned === 'true' || loan.returned;

        const updatedLoan = await loan.save();
        // return populated data 
        const populatedLoan = await Loan.findById(updatedLoan._id)
            .populate('book', 'title author')
            .populate('member', 'firstName lastName');
        res.json(populatedLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete loan
const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found!'});

        await Loan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Loan deleted'});

    } catch (error) {
        res.status(500).json({message: error.message });
    }
}

module.exports = { getLoans, addLoan, updateLoan, deleteLoan };