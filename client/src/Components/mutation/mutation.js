import {
    gql,
  } from "@apollo/client";

const SaveItemString = gql`
mutation  {
    addItem(UserId: '626445d60eac6d35bda3437d', Name: 'vinetest, Description:'wsf', Price:10, Quantity:2){
    successMessage
  }
}
`;

export {SaveItemString};