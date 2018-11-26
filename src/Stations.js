import React, {Component} from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import Modal from './Modal';

class StationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      serial:'',
      password:''
    };

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange (event) {
    this.setState({
      [event.target.name] : event.target.value
    });

    
  }

  componentDidUpdate(){
    this.props.handleChange(this.state); 
  }

  render() {
    
    return(
      <div className='modal-form-inputs-wrap'>
        
        <Input
          required={true}
          name='name'
          label='NAME'
          value={this.state.name}
          onChange={this.handleChange}/>

        <Input
          required={true}
          name='serial'
          label='SERIAL NO'
          value={this.state.serial}
          onChange={this.handleChange}/>

        <Input
          required={true}
          name='password'
          label='PASSWORD'
          value={this.state.password}
          onChange={this.handleChange}/>
      </div>
    );
  }
}

class ModalForm extends Component {

  constructor(props){
    super(props);
    this.station = {
      name: '',
      password:'',
      serial:'' 
      };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(station){
    this.station = station;
    console.log(this.station);
  }

  render(){

      let dialog = this.props.visible &&
      <Dialog title={'Add Station '} onClose={this.props.close} className='add-station-dialog'>
        
        <div className='modal-wrap'>
          <div className='modal-form-wrap'>
                  <StationForm handleChange={this.handleChange}/>
          </div>
        </div>
        <DialogActionsBar>
            <button className="k-button" onClick={this.props.close}>Cancel</button>
            <button className="k-button" onClick={() => {this.props.addStation(this.station)}}>Add</button>
        </DialogActionsBar>
      </Dialog>;
      return (dialog);
  }
}

class StationCard extends Component {
  render () {

      return (

        <div className="mdl-cell mdl-cell--8-col">
          <div className="ag-station-card mdl-card mdl-shadow--2dp">
              <div className="mdl-card__title mdl-card--expand">
                <h4>
                  Station Info: {this.props.name}
                  <br/>
                  {this.props.serial}
                </h4>
              </div>
              <div className="mdl-card__actions mdl-card--border">
                <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                    May 24, 2016 7:11 PM
                </a>
                <div className="mdl-layout-spacer"></div>
                <i className="material-icons">more_vert</i>
              </div>
            </div>
        </div>
      );
  }
}


class Stations extends Component {
  constructor(props){
    super(props);

    this.state = {
      stations:[],
      showDialog: false
    }

    fetch('http://34.216.6.101:8000/stations/')
    .then((response) => {
      return response.json();
    })
    .then((stations) => {
      this.setState({
        stations:stations
      });
    })
    .catch(error => console.error('Error:', error));

    this.addStation = this.addStation.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  openDialog() {
    this.setState({
      showDialog:true
    });
  }

  closeDialog() {
    this.setState({
      showDialog:false
    });
  }

  addStation(station){
    console.log(station);
    fetch('http://34.216.6.101:8000/stations/', 
      {
        method:'POST',
        body:JSON.stringify(station),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((stations) => {
      this.setState((state, props) => {
        let prev_stations = state.stations.slice();
        prev_stations.push(stations);
        return {stations:prev_stations};  
      });
      
      this.closeDialog();
    })
    .catch(error => console.error('Error:', error));

  }

  render() {

    let stations = this.state.stations.map((station) => {
      return (<StationCard key={station.id} name={station.name} serial={station.serial} />)
    })

    return (

        <div className="mdl-grid ag-stations-grid">
            {stations}

            <button onClick={this.openDialog} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--primary ag-add-button">
              <i className="material-icons" role="presentation">add</i>
              <span className="visuallyhidden">Add</span>
            </button>
            <Modal>
              <ModalForm 
                visible={this.state.showDialog}
                close={this.closeDialog}
                addStation={this.addStation}
              />
            </Modal>
        </div>

      );
  }
}

export default Stations;