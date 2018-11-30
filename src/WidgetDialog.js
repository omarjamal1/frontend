import React, {Component} from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input, Switch } from '@progress/kendo-react-inputs';
import {DateRangePicker} from '@progress/kendo-react-dateinputs';

class StationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      min_date:'',
      max_date:'',
      maximized:'',
      daterange:{start:new Date(), end:new Date()}
    };

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (event) => {

        console.log(event.target.value);    
        // this.setState({daterange:event.target.value});
        this.setState({
          [event.target.props.name]: event.target.value
        });

        if(event.target.props.name === 'daterange'){
          this.setState({
            min_date:event.target.value.start,
            max_date:event.target.value.end,
          })
        }

    this.props.handleChange(this.state);
  }

  componentDidUpdate(){
    console.log(this.state);
  }

  render() {
    
    return(
      <div className='modal-widget-dialog-inputs-wrap'>
        
        <Input
          required={true}
          name='name'
          label='NAME'
          value={this.state.name}
          onChange={this.handleChange}/>

        <DateRangePicker 
          name='daterange'
          value={this.state.daterange}
          calendarSettings={{views:1}}
          popupSettings = {this.popupSettings}
          onChange={this.handleChange}
        />

        <div>
          <br/>
          <p>MAXIMIZED</p>
          <Switch 
            name='maximized' 
            onChange={this.handleChange}
          />
        </div>

      </div>
    );
  }
}

class WidgetDialog extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      min_date:'',
      max_date:'',
      maximized:'' 
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(widget){
    this.setState(widget);
  }

  render(){

      let dialog = this.props.visible &&
      <Dialog title={'Add Station '} onClose={this.props.close} className='add-widget-dialog'>
        
        <div className='modal-wrap'>
          <div className='modal-form-wrap'>
                  <StationForm handleChange={this.handleChange}/>
          </div>
        </div>
        <DialogActionsBar>
            <button className="k-button" onClick={this.props.close}>Cancel</button>
            <button className="k-button" onClick={() => {this.props.addWidget(this.state)}}>Add</button>
        </DialogActionsBar>
      </Dialog>;
      return (dialog);
  }
}



export default WidgetDialog;