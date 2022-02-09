import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BulletinData, Datasets } from './model/dataset';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import BulletinList from "./pages/List";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import { Validation } from './pages/Validation';

class App extends React.Component<{}, { bulletinData: Array<BulletinData> }> {
  datasets: Datasets;

  constructor(props: {}) {
    super(props)
    this.datasets = new Datasets();
    this.state = { bulletinData: [] }
  }
  async componentDidMount() {
    await this.datasets.fetchDatasets();
    var data = this.datasets.getDatasets();
    this.setState({ bulletinData: data });

    await this.datasets.fetchAllDistibutions();
    var data = this.datasets.getDatasets();
    this.setState({ bulletinData: data });
  }
  render() {
    var datasets = this.state.bulletinData;
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Layout /> }>
            <Route index element={ <Home /> } />
            <Route path="seznam" element={ <BulletinList data={datasets} /> } />
            <Route path="validace" element={ <Validation data={datasets} /> } />
            <Route path="*" element={ <NoPage /> } />
          </Route>
        </Routes>
      </BrowserRouter>

    );
  }
}


export default App;
