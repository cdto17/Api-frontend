import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css'
import Inicio from "./Views/Inicio";
import RESTful from "./Views/RESTful/RESTful";
import GraphQL from "./Views/GraphQL/GraphQL";

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/button1" element={<RESTful />} />
                    <Route path="/button2" element={<GraphQL />} />
                    <Route path="/button3" element={<Inicio />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
