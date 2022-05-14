import './App.css';
import React, { useReducer } from "react";
import itemReducer from "../src/context/reducers/reducer";
import currencyReducer from "../src/context/reducers/currencyReducer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from './Components/Home';
import UserAccount from './Components/UserAccount';
import PersonProfile from './Components/PersonProfile';
import Shop from './Components/Shop';
import ShopHome from './Components/shopHome';
import Item from './Components/Item';
import Cart from './Components/Cart';
import Purchases from './Components/Purchases';
import { SearchContext } from "./context/SearchContext";
import { CurrencyContext } from "./context/CurrencyContext";
import { Provider } from "react-redux";
import store from "./store";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:8001/graphql',
  cache: new InMemoryCache()
});


function App() {
  const [search, dispatch] = useReducer(itemReducer, '');
  const [currency, dispatch1] = useReducer(currencyReducer, '$');
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <div className="App">
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/person">
                <UserAccount />
              </Route>
              <Route exact path="/personProfile">
                <PersonProfile />
              </Route>
              <Route exact path="/shop">
                <Shop />
              </Route>
              <Route exact path="/shopHome">
                <ShopHome />
              </Route>
              <Route exact path="/item">
                <Item />
              </Route>
              <Route exact path="/cart">
                <Cart />
              </Route>
              <Route exact path="/purchases">
                <Purchases />
              </Route>
              {/* <Route exact path="/chat">
          </Route>
          <Route exact path="/recruiter">
            <TinderCards user="recruiter"/>
          </Route> */}
            </Switch>
          </Router>
        </div>
      </Provider>
    </ApolloProvider>

  );
}

export default App;
