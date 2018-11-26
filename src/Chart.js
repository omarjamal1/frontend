import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";
import ModalForm from './ChartDialog';
import Modal from './Modal';


class MoreMenu extends Component {
  render(){
    return (
      <div>
        <button id={this.props.menuId}
                className="mdl-button mdl-js-button mdl-button--icon ">
          <i className="material-icons">more_vert</i>
        </button>

        <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
            data-mdl-for={this.props.menuId}>
            <li className="mdl-menu__item">
              Remove
            </li>
            <li className="mdl-menu__item">
              Duplicate
            </li>
        </ul>
      </div>
    );
  }
}

class QuickDateMenu extends Component {
  render(){
    return (
      <div>
        <button id={this.props.menuId} className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'>
          <i className='material-icons'>event</i>
        </button>
        <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
            data-mdl-for={this.props.menuId}>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              Today
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              Yesterday
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              1 Week
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              2 Weeks
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              1 Month
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              3 Months
            </span>
          </li>
          <li className="mdl-menu__item">
            <span className="mdl-list__item-primary-content">
              6 Months
            </span>
          </li>
        </ul>
      </div>
    );
  }
} 

class Chart extends Component {
  constructor(props) {
    super(props);

    let dataProvider = this.getData();
    var graphs = [];
    for (let i = 0; i < this.props.graphs.length; i++){
        let graph = {
                    "id"            : this.props.graphs[i].id,
                    "title"         : this.props.graphs[i].label,
                    "type"          : this.props.graphs[i]._type,
                    "lineColor"     : this.props.graphs[i].color,
                    "valueField"    : this.props.graphs[i].label,
                    "fillAlphas"    : this.props.graphs[i]._type === 'line' ? 0:1,
                    "lineThickness"  : this.props.graphs[i]._type === 'line' ? 2:1,
                    "behindColumns" : this.props.graphs[i]._type === 'column' ? true:false,
                  };
        graphs.push(graph);
    }

    this.state = {
      title: '',
      graphs: graphs,
      editing: false,
      sensors: [],
      dataProvider: dataProvider,
    };

    this.graph = null;

    this.getData = this.getData.bind(this);
    this.openEditingModal = this.openEditingModal.bind(this);
    this.closeEditingModal = this.closeEditingModal.bind(this);
    this.updateChart = this.updateChart.bind(this);    
  }

  getData (){

    let dataProvider = [];
    for (let i = 0; i < this.props.graphs.length; i++){
        for(let j=0; j < this.props.graphs[i].data.length; j++){
          if (dataProvider[j] === undefined)
            dataProvider[j] = {};
          dataProvider[j][this.props.graphs[i].label] = this.props.graphs[i].data[j].value
          dataProvider[j]['date'] = this.props.graphs[i].data[j].date
        }
    }

     return dataProvider;

  }

  componentDidMount(){
    
  }
   
  openEditingModal() {
    this.setState({
      editing: true
    });
  }

  closeEditingModal() {
    this.setState({
      editing: false
    });
  }

  updateChart(data){
    this.closeEditingModal();
    fetch(`http://34.216.6.101:8000/graphs/${this.props.chartId}/`)
    .then(response => response.json())
    .then(graphs => {
      let graphList = [];
      for (let i = 0; i < graphs.length; i++){
          let graph = {
            "id"            : graphs[i].id,
            "title"         : graphs[i].label,
            "type"          : graphs[i]._type,
            "lineColor"     : graphs[i].color,
            "valueField"    : graphs[i].label,
            "fillAlphas"    : graphs[i]._type === 'line' ? 0:1,
            "lineThickness"  : graphs[i]._type === 'line' ? 2:1,
            "behindColumns" : graphs[i]._type === 'column' ? true:false,
          };
          graphList.push(graph);
      }
      let dataProvider = [];
      for (let i = 0; i < graphs.length; i++){
          for(let j=0; j < graphs[i].data.length; j++){
            if (dataProvider[j] === undefined)
              dataProvider[j] = {};
            dataProvider[j][graphs[i].label] = graphs[i].data[j].value
            dataProvider[j]['date'] = graphs[i].data[j].date
          }
      }

      this.setState({
        graphs:graphList,
        dataProvider:dataProvider
      });
    });
  }

  render(){

    return (
    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
        <div id="chart-ctn">
          <div className='chart-card mdl-card mdl-shadow--2dp'>
            <div className='mdl-card__title'>
              <AmCharts.React
                className="my-class"
                style={{
                  width: "100%",
                  height: "350px"
                }}
                options={{
                  "type": "serial",
                  "theme": "light",
                  "marginRight": 15,
                  "marginLeft": 40,
                  "marginTop" : 10,
                  "marginBottom" : 0,
                  "autoMarginOffset": 20,
                  "balloon": {
                      "borderThickness": 2,
                      "shadowAlpha": 0
                  },
                  "chartScrollbar": {
                      "graph": "g1",
                      "oppositeAxis":false,
                      "offset":30,
                      "scrollbarHeight": 20,
                      "backgroundAlpha": 0,
                      "selectedBackgroundAlpha": 0.1,
                      "selectedBackgroundColor": "#888888",
                      "graphFillAlpha": 0,
                      "graphLineAlpha": 0.5,
                      "selectedGraphFillAlpha": 0,
                      "selectedGraphLineAlpha": 1,
                      "autoGridCount":true,
                      "color":"#AAAAAA",
                      "dragIconWidth":20,
                      "dragIcon":'dragIconRoundSmall'

                  },
                  "chartCursor": {
                      "pan": true,
                      "valueLineEnabled": true,
                      "valueLineBalloonEnabled": true,
                      "cursorAlpha":1,
                      "cursorColor":"#258cbb",
                      "limitToGraph":"g1",
                      "valueLineAlpha":0.2, 
                      "categoryBalloonDateFormat": 'MMM DD, YYYY JJ:NN'
                  },
                  "legend": {
                     "useGraphSettings": true,
                     "position": "bottom",
                     "marginTop": 0,
                     "marginBottom": 0, 
                     "autoMargins": false, 
                     "verticalGap": 0,
                     "fontSize": 10,
                     "spacing": 5,
                     "marginLeft": 5,
                     "marginRight": 5,
                     "markerLabelGap": 2, 
                     "markerSize": 10, 
                     "valueWidth": 40,
                   },
                  "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
                  "categoryField": "date",
                  "categoryValue": "value",
                  "valueField":"value",
                  "precision": 2,
                  "categoryAxis": {
                      "parseDates": true,
                      "dashLength": 1,
                      "minorGridEnabled": true
                  },
                  "graphs": this.state.graphs,
                  "dataProvider": this.state.dataProvider,
                  "creditsPosition": null
                }} />
            </div>

            <div className='mdl-card__actions mdl-card--border'>
              
              <div className="mdl-layout-spacer"></div>
              <button 
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              onClick={this.openEditingModal}
              >
                        <i className='material-icons'>edit</i>
              </button>
              <Modal>
                <ModalForm 
                  visible={this.state.editing}
                  close={this.closeEditingModal}
                  updateChart={this.updateChart}
                  chartTitle={this.state.title}
                  handleChange={this.handleChange}
                  graphs={this.state.graphs}
                  sensors={this.props.sensors}
                  chartId={this.props.chartId}
                />
              </Modal>

              <QuickDateMenu menuId={'quickdatemenu'+this.props.chartId}/>
              <MoreMenu menuId={'moremenu'+this.props.chartId}/>
              
            </div>
            <div className='mdl-card__menu'>
        
              {/*<button 
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              >
                <i className='material-icons'>calendar_today</i>
              </button> */}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Chart;