import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";
import ModalForm from './ChartDialog';
import Modal from './Modal';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

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

class Chart2 extends Component {
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
      chart:null
    };

    this.graph = null;

    this.getData = this.getData.bind(this);
    this.openEditingModal = this.openEditingModal.bind(this);
    this.closeEditingModal = this.closeEditingModal.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.createRange = this.createRange.bind(this);
    this.createChart = this.createChart.bind(this);
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

  createRange(axis, _from, to, color) {
    let range = axis.axisRanges.create();
    range.value = _from;
    range.endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.8;
    range.label.disabled = false;
  }

  createChart(graphs){

    let chart = am4core.create(this.props.chartId, am4charts.XYChart);

    //chart data
    chart.data = this.state.dataProvider;
    // chart scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.height = .2;
    chart.scrollbarX.maxHeight = 20;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.location = 0;
    dateAxis.id = 'dateAxisID';

    for (let i = 0; i < graphs.length; i++ ){
      //current item
      let graph = graphs[i];

      let graphAxisExists = false;
      let axis;
      if (graph.calculation !== 'raw'){
        for(let a = 0; a < chart.yAxes.length; a++){
          if(chart.yAxes.getIndex(a).id === graph.calculation){
            graphAxisExists = true;
            axis = chart.yAxes.getIndex(a);
          }

        }
      }else{
        for(let a = 0; a < chart.yAxes.length; a++){
          if(chart.yAxes.getIndex(a).id === graph.extract){
            graphAxisExists = true;
            axis = chart.yAxes.getIndex(a);
          }
        }
      }

      
      if(!graphAxisExists){
        axis = chart.yAxes.push(new am4charts.ValueAxis());
        if(graph.calculation === 'raw'){
          axis.id = graph.extract;
        }else{
          axis.id = graph.calculation;

        }

        axis.title.text = graph.label;
      }

      //paw range guides
      console.log(graph.paw_guides);
      if(graph.paw_guides){
        this.createRange(axis, 1, 30, am4core.color("#ffb3ba"));
        this.createRange(axis, 30, 70, am4core.color("#ffffba"));
        this.createRange(axis, 70, 100, am4core.color("#baffc9"));
        this.createRange(axis, 100, 200, am4core.color("#6ec0ff"));
      }


      //display alternate axis on the opposite side
      if(i % 2 !== 0)
        axis.renderer.opposite = true;

      //axis min/max
      if(graph.axis_min !== null)
        axis.min = graph.axis_min;

      if(graph.axis_max !== null)
        axis.max = graph.axis_max;

      //precision
      axis.maxPrecision = 1;
      // axis.dx = i*20;
      // axis.renderer.inside = true;
      axis.renderer.labels.template.fillOpacity = 1;
      axis.renderer.grid.template.strokeOpacity = 0;
      axis.renderer.labels.template.fill = am4core.color(graph.color);
      axis.title.fill = am4core.color(graph.color);
      // axis.renderer.grid.template.strokeDasharray = "2,3";
      axis.tooltip.disabled = true;
      let series;

      //graph type
      if(graph._type === 'line'){
        series = chart.series.push(new am4charts.LineSeries());
        series.stroke = am4core.color(graph.color);
      }else{
        series = chart.series.push(new am4charts.ColumnSeries());
        series.fill = am4core.color(graph.color);
      }

      //series data-field:
      //graph.label is used as the property
      //that holds the value for a graph in dataProvider.
      series.dataFields.valueY = graph.label;
      //date-field of chart
      series.dataFields.dateX = 'date';
      series.name = graph.label;
      series.strokeWidth = 2;
      // series.tensionX = .9;
      // series.tensionY = 0.1;
      series.yAxis = axis;
      series.toolTipText = '{name}\n[bold font-size: 20]{valueY}[/]';
      chart.scrollbarX.series.push(series);
    }

    // chart cursor
    chart.cursor = new am4charts.XYCursor();

    // chart legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    return chart;

  }

  componentDidMount(){
    let chart = this.createChart(this.props.graphs);
    this.setState({chart:chart});
  }
   
  componentWillUnmount(){
  	if(this.state.chart){
  		this.state.chart.dispose();
  	}
  }

  componentDidUpdate(){
    this.state.chart.dataProvider = this.state.dataProvider;
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

      let dataProvider = [];
      for (let i = 0; i < graphs.length; i++){
          for(let j=0; j < graphs[i].data.length; j++){
            if (dataProvider[j] === undefined)
              dataProvider[j] = {};
            dataProvider[j][graphs[i].label] = graphs[i].data[j].value
            dataProvider[j]['date'] = graphs[i].data[j].date
          }
      }

      this.state.chart.dispose();

      let chart = this.createChart(graphs);

      this.setState({
        dataProvider:dataProvider,
        chart:chart
      });

      
    });
  }

  render(){

    return (
    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
        <div id="chart-ctn">
          <div className='chart-card mdl-card mdl-shadow--2dp'>
            <div className='mdl-card__title'>
              <div id={this.props.chartId} style={{ width: "100%", height: "100%" }}> </div>
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

export default Chart2;