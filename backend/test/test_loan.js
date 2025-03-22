const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Loan = require('../models/Loan');

const { updateLoan, getLoans, addLoan, deleteLoan } = require('../controllers/loanController');

const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

// Restore all stubs between tests
beforeEach(() => {
  sinon.restore();
});

describe('AddLoan Function Test', () => {

  it('should create a new loan successfully', async () => {
    // Mock request data
    const bookId = new mongoose.Types.ObjectId();
    const memberId = new mongoose.Types.ObjectId();
    const req = {
      body: { 
        book: bookId, 
        member: memberId, 
        loanDate: new Date(), 
        returned: 'false' 
      }
    };

    // Mock loan that would be created
    const createdLoan = { 
      _id: new mongoose.Types.ObjectId(), 
      ...req.body,
      returned: false
    };
    
    // Stub Loan.create to return the createdLoan
    const createStub = sinon.stub(Loan, 'create').resolves(createdLoan);
    
    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Mock the populate chain that happens after creation
    const mockFindById = sinon.stub(Loan, 'findById');
    mockFindById.returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          ...createdLoan,
          book: { title: 'Test Book', author: 'Test Author' },
          member: { firstName: 'Test', lastName: 'User' }
        })
      })
    });

    // Call function
    await addLoan(req, res);

    // Assertions
    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Loan.create to throw an error
    sinon.stub(Loan, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      body: { 
        book: new mongoose.Types.ObjectId(), 
        member: new mongoose.Types.ObjectId(), 
        loanDate: new Date(), 
        returned: 'false' 
      }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addLoan(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('UpdateLoan Function Test', () => {

  it('should update loan successfully', async () => {
    // Mock loan data
    const loanId = new mongoose.Types.ObjectId();
    const bookId = new mongoose.Types.ObjectId();
    const memberId = new mongoose.Types.ObjectId();
    
    // Create a loan with a save method
    const existingLoan = {
      _id: loanId,
      book: new mongoose.Types.ObjectId(),
      member: new mongoose.Types.ObjectId(),
      loanDate: new Date('2023-01-01'),
      returned: false,
      save: sinon.stub().resolvesThis()
    };
    
    // Mock request & response
    const req = {
      params: { id: loanId.toString() },
      body: { 
        book: bookId.toString(), 
        member: memberId.toString(), 
        loanDate: new Date('2023-02-01'), 
        returned: 'true' 
      }
    };
    
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // First findById call returns the existing loan
    const findByIdStub = sinon.stub(Loan, 'findById');
    findByIdStub.onFirstCall().resolves(existingLoan);
    
    // Second findById call handles the populate chain
    findByIdStub.onSecondCall().returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          ...existingLoan,
          book: { title: 'Test Book', author: 'Test Author' },
          member: { firstName: 'Test', lastName: 'User' },
          returned: true
        })
      })
    });

    // Call function
    await updateLoan(req, res);

    // Assertions
    expect(existingLoan.book.toString()).to.equal(bookId.toString());
    expect(existingLoan.member.toString()).to.equal(memberId.toString());
    expect(existingLoan.returned.toString()).to.equal('true');
    expect(existingLoan.save.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set
  });

  it('should return 404 if loan is not found', async () => {
    sinon.stub(Loan, 'findById').resolves(null);

    // Mock request data
    const req = { 
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {}
    };
    
    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateLoan(req, res);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Loan not found!' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    // Stub Loan.findById to throw an error
    sinon.stub(Loan, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { 
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {}
    };
    
    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateLoan(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('GetLoan Function Test', () => {

  it('should return all loans', async () => {
    // Mock loan data
    const loans = [
      { 
        _id: new mongoose.Types.ObjectId(), 
        book: { title: 'Book 1', author: 'Author 1' }, 
        member: { firstName: 'User', lastName: '1' },
        loanDate: new Date(),
        returned: false
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        book: { title: 'Book 2', author: 'Author 2' }, 
        member: { firstName: 'User', lastName: '2' },
        loanDate: new Date(),
        returned: true
      }
    ];

    // Setup the find stub with populate chain
    const findStub = sinon.stub(Loan, 'find').returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves(loans)
      })
    });

    // Mock request & response
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getLoans(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(loans)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set
  });

  it('should return 500 on error', async () => {
    // Stub the find chain to throw an error
    sinon.stub(Loan, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getLoans(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('DeleteLoan Function Test', () => {

  it('should delete a loan successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock loan found in the database
    const loan = { remove: sinon.stub().resolves() };

    // Stub Loan.findById to return the mock loan
    sinon.stub(Loan, 'findById').resolves(loan);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLoan(req, res);

    // Assertions
    expect(loan.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Loan deleted' })).to.be.true;
  });

  it('should return 404 if loan not found', async () => {
    // Stub Loan.findById to return null
    sinon.stub(Loan, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLoan(req, res);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Loan not found!' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    // Stub Loan.findById to throw an error
    sinon.stub(Loan, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLoan(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});