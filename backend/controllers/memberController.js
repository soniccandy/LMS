// get member (read)
const Member = require('../models/Member.js');

const getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// add member
const addMember = async (req, res) => {
    const { firstName, lastName, address, email, phone } = req.body;
    try {
        const member = await Member.create({ firstName, lastName, address, email, phone });
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update member
const updateMember = async (req, res) => {
    const { firstName, lastName, address, email, phone } = req.body;
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found!'});
        member.firstName = firstName || member.firstName;
        member.lastName = lastName || member.lastName;
        member.address = address || member.address;
        member.email = email || member.email;
        member.phone = phone || member.phone;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete member
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found!'});

        await member.remove();
        res.json({ message: 'Member deleted'});

    } catch (error) {
        res.status(500).json({message: error.message });
    }
}

module.exports = { getMembers, addMember, updateMember, deleteMember };