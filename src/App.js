
import React, { Component } from 'react';
import './App.css';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min';
import './chart.css';
import '@progress/kendo-theme-material/dist/all.css';
import Stations from './Stations';
import Modal from './Modal';
import WidgetDialog from './WidgetDialog';
import Chart from './Chart';

class Layout extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: 'AgViewer'
    };
  }

  render() {
    return (

        <div 
          className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-drawer"
        >

          <header className="mdl-layout__header mdl-layout__header--waterfall">

              <div className="mdl-layout-icon">kk</div>

              <div className="mdl-layout__header-row">
                
                <span className="mdl-layout-title">AGVIEWER<sup>Beta</sup></span>
                <div className="mdl-layout-spacer"></div>
                
              </div>

              <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                {this.props.tabs}
                <a 
                  href="#dummy"
                  className="add-tab-button"
                  onClick={(e) => {this.props.addTab(e)}}

                >
                  <i className="material-icons ">add</i>
                </a>
                
              </div>
              
          </header>

          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">Agviewer<sup>Beta</sup></span>
            <nav className="mdl-navigation">
              <a 
                className="mdl-navigation__link"
                onClick={(e) => {this.props.onClick(e, 'dashboard')}}
              href='/dashboard/'>
                Dashboard
              </a>
             {/* <a 
                className="mdl-navigation__link"
                onClick={(e) => {this.props.onClick(e, 'profile')}}
              href='/profile/'>
                Profile
              </a>
              <a  
                className="mdl-navigation__link"
                onClick={(e) => {this.props.onClick(e, 'settings')}}
              href='/profile/'>
                Settings
              </a> */}
               <a  
                className="mdl-navigation__link"
                onClick={(e) => {this.props.onClick(e, 'stations')}}
              href='/stations/'>
                Stations
              </a>
            </nav>
            <div className="ag-spacer">
            </div>
            <div className="ag-logout-ctn">
              <a  
                className="mdl-navigation__link ag-logout"
                onClick={(e) => {this.props.logout(e)}}
              href='/logout/'>
                Logout
              </a>
            </div>
          </div>

          <main className="mdl-layout__content">
            
            {this.props.content}
            
          </main>

        </div>



      );
  }
}

// function to get csrfcookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: 'AgViewer',
      visible: false,
      showWidgetDialog:false,
      charts: [],
    };

    this.loadCharts = this.loadCharts.bind(this);
    this.openWidgetDialog = this.openWidgetDialog.bind(this);
    this.closeWidgetDialog = this.closeWidgetDialog.bind(this);
    this.addWidget = this.addWidget.bind(this);
    this.loadSensors = this.loadSensors.bind(this);
  }

  componentDidMount(){
    this.loadCharts();
    this.loadSensors();
  }

  addWidget(widget){
    let url = 'http://dev.agviewer.net/api/charts/' + this.props.tabId + '/';
    fetch(url, 
      {
        method:'POST',
        body:JSON.stringify(widget),
        credentials: 'include',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-CSRFToken": getCookie("csrftoken")
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((widget) => {
      this.setState((state, props) => {
        let prev_charts = state.charts.slice();
        prev_charts.push(widget);
        return {charts:prev_charts};
      });
      
      this.closeWidgetDialog();
    })
    .catch(error => console.error('Error:', error));
  }

  openWidgetDialog(){
    this.setState({
      showWidgetDialog:true
    });
  }

  closeWidgetDialog(){
    this.setState({
      showWidgetDialog:false
    });
  }

  loadCharts () {
    
    let url = 'http://dev.agviewer.net/api/charts/' + this.props.tabId;
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((charts) => {
      this.setState({
        charts: charts
      });
    })
    .catch(error => console.error('Error:', error));
  }

  loadSensors() {

    let url = 'http://dev.agviewer.net/api/sensors/';
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((sensors) => {
      this.setState({
        sensors: sensors
      });
    })
    .catch(error => console.error('Error: ', error));

  }

  render() {

    let activeClass = this.props.isActive ? "is-active" : ""; 
    let charts = this.state.charts.map((chart) => <Chart name={chart.name} chartId={chart.id} key={chart.id} graphs={chart.graphs} sensors={this.state.sensors}/>);

    return (

      <section className={"mdl-layout__tab-panel "+ activeClass} id={"tab"+this.props.tabId}>

        <div className="mdl-grid">

              {this.state.charts && charts} 

        </div>

        <button onClick={this.openWidgetDialog} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--accent ag-add-button" id="ag_add_widget">
          <i className="material-icons" role="presentation">add</i>
          <span className="visuallyhidden">Add</span>
        </button> 

        <Modal>
          <WidgetDialog
            visible={this.state.showWidgetDialog}
            close={this.closeWidgetDialog}
            addWidget={this.addWidget}
           />
        </Modal>

      </section>

    );
  }
}

class Settings extends Component {
  render(){

    return <div>Settings </div>;
  }
    
}

class Profile extends Component {
  render() {

    return (<div>Profile </div>);
  }
}



class Tab extends Component {

  render(){
    let activeClass = this.props.isActive ? "is-active": "";
    return (
      <a 
        href={'#'+this.props.href}
        onClick={(e) => this.props.onClick(e, this.props.id)}
        className={"mdl-layout__tab " + activeClass }
      >
        {this.props.tabName}
      </a>
    );
  }
}


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      page: 'dashboard',
      currentTab: null,
      tabs:[],
      signedin:false
    }

    this.navigate = this.navigate.bind(this);
    this.addTab = this.addTab.bind(this);
    this.makeTabCurrent = this.makeTabCurrent.bind(this);
    this.loadTabs = this.loadTabs.bind(this);
    this.loadTabs();
    this.signin = this.signin.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    
  }

  signin = (credentials) => {

    let url = 'http://dev.agviewer.net/api/login/';
    fetch(url, 
      {
        method:'POST',
        body:JSON.stringify(credentials),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.setState({signedin:true});
    })
    .catch(error => console.error('Error:', error));

  }

  loadTabs(){
    fetch('http://dev.agviewer.net/api/tabs/')
    .then((response) => {
      // response.text().then((text) => {
      //   console.log(text);
      // });
      return response.json();
    })
    .then((tabs) => {
      this.setState({
        page: 'dashboard',
        currentTab: tabs[0].id,
        tabs:tabs
      });
    })
    .catch(error => {
      console.error('Error:', error);
      window.location.href = 'http://dev.agviewer.net/login/';
    });
  }

  navigate(e, page){
    e.preventDefault();
    this.setState({page: page});
  }

  addTab(e){
    e.preventDefault();

    let tabs = this.state.tabs.slice();
    tabs.push(tabs[tabs.length - 1] + 1);
    let tabId = tabs[tabs.length - 1];
    this.setState({
      tabs: tabs,
      currentTab: tabId
    });
  }

  makeTabCurrent(e, tabId) {
    // let tabId = 
    e.preventDefault();
    this.setState({
      currentTab: tabId
    });
  }

  logout(e) {

    e.preventDefault();
    let url = 'http://dev.agviewer.net/logout/';
    fetch(url, 
      {
        method:'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-CSRFToken": getCookie("csrftoken")
        },
      }
    )
    .then((response) => {
      window.location.href = 'http://dev.agviewer.net/login/';
    })
    .catch(error => console.error('Error:', error));

  }

  render() {

    let page, tabs;

    tabs = this.state.tabs.map(
      (tab, i) => {
          let active = this.state.currentTab === tab.id ? true: false;
          //why tab.id is doesn't work as key?
          return (<Tab 
            key={i}
            onClick={this.makeTabCurrent}
            href={'tab'+tab.id}
            isActive={active}
            id={tab.id}
            tabName={tab.name}
          />);
        }
      );

    switch (this.state.page){
      case 'settings':
        page = <Settings/>;
        break;
      case 'profile':
        page = <Profile/>;
        break;
      case 'stations':
        page = <Stations/>;
        break;
      default:
        page = this.state.tabs.map((tab, i) => {
          let active = this.state.currentTab === tab.id ? true: false;
          return (
            <Dashboard 
            //why tab.id doesn't work as key?
              key={i}
              tabId={tab.id}
              isActive={active}
            />
          );
        });
    }

    // let element = this.state.signedin ?  <Layout
    //     content={page}
    //     tabs={tabs}
    //     onClick={this.navigate}
    //     addTab={this.addTab}
    //   /> : <Login login={this.signin}/> ;


    return (
        <Layout
          content={page}
          tabs={tabs}
          onClick={this.navigate}
          logout={this.logout}
          addTab={this.addTab}
        />
    );
    
  }
}

export default App;
