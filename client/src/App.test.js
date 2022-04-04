import { render, screen } from '@testing-library/react';
import App from './App';
import SigninModal from '../src/Components/SigninModal'
import ItemModal from '../src/Components/ItemModal'
import PersonProfile from '../src/Components/PersonProfile'
import ChangeNameModal from './Components/ChangeNameModal';

test('render signin modal', ()=>{
    render(<SigninModal show={true}/>);
    const emailAddress = screen.getByText('Email address');
    const Password = screen.getByText('Password');
    expect(emailAddress).toBeInTheDocument();
    expect(Password).toBeInTheDocument();
})

test('render item modal', ()=>{
  render(<ItemModal show={true}/>);
    const Description = screen.getByText('Description');
    const Price = screen.getByText('Price');
    const Quantity = screen.getByText('Quantity');
    expect(Description).toBeInTheDocument();
    expect(Price).toBeInTheDocument();
    expect(Quantity).toBeInTheDocument();
})

test('render change name modal', ()=>{
  render(<ChangeNameModal show={true}/>);
    const firstName = screen.getByText('First Name');
    const lastName = screen.getByText('Last Name');
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
})
