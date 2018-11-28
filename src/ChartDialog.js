import React, {Component} from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { Input, NumericTextBox, Switch } from '@progress/kendo-react-inputs';
import {DateRangePicker} from '@progress/kendo-react-dateinputs';


class GraphChip extends Component {
	constructor (props) {
		super(props);
		this.state = {
			selected: false
		}
	}

	render () {
		let type;
		if (this.props.type === 'column'){
			type = 'bar_chart';
		}else{
			type = 'show_chart';
		}

		return (
			<li className='ag-graphchip-item'>
		      <span className="mdl-chip mdl-chip--contact mdl-chip--deletable">
		        <span className="mdl-chip__contact" style={{background:this.props.color, color:'white'}}><i className=" material-icons" >{type}</i></span>
		        <span className="mdl-chip__text">{this.props.label}</span>
		        <a href="javascript:void(0)" onClick={() => this.props.remove(this.props.graphId)} className="mdl-chip__action"><i className="material-icons">cancel</i></a>
		      </span>
		    </li>
		);
	}
}

class GraphChipContainer extends Component {
	render(){
		return (
			<ul className='ag-graphchip-container'>
				{this.props.children}
			</ul>
		);
	}
}

class ColorSelect extends Component {

	itemRender = (li, itemProps) => {
		// const index = itemProps.index;
		const itemChildren = <div style={{background:itemProps.dataItem, width:'100%'}}>
			 &nbsp; </div>;

		return React.cloneElement(li, li.props, itemChildren);
	}

    valueRender = (element, value) => {
        if (!value) {
            return element;
        }

        const item =
            <div style={{width:'100%', background:value}}> &nbsp; </div>;

        return React.cloneElement(element, { ...element.props }, item);
    }

    render() {
        return (
            <DropDownList
            	label='COLOR'
            	name={this.props.name}
            	onChange={this.props.onChange}
                data={this.props.data}
                valueRender={this.valueRender}
                itemRender={this.itemRender}
            />
        );
    }
}


class RawSensorForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			graphName: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red'],
			sensors: [], 
			extracts:[],
			extract:null,
			paw_guides:false,
			pawGuides:null,
	    };

	    this.setInitialValues = this.setInitialValues.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	    this.itemRender = this.itemRender.bind(this);
	}

	setInitialValues(){
		this.setState(this.props.initialValues);
		this.setState(this.props.options);
	}

	handleChange (event) {
		this.setState({
			[event.target.name] : event.target.name === 'graphType' || event.target.name === 'paw_guides' ? event.target.value.value :event.target.value,
			pawGuides: event.target.name === 'paw_guides' ? event.target.value: this.setState.pawGuides
		});

		if (event.target.name === 'sensors'){
			if (event.target.value.length > 0){
				fetch(`http://34.216.6.101:8000/extracts/${event.target.value[0].id}/`)
				.then(response => response.json())
				.then(extracts => {
					this.setState({
						extracts: extracts
					});
				});	
			}
		}
	}

	componentDidUpdate(){
		console.log(this.state);
		this.props.handleChange('raw', this.state);
	}

	itemRender (li, itemProps) {
		console.log(itemProps);
		const itemChildren = <div> {li.props.children} <div style={{ color: "#00F" }}> {itemProps.dataItem.device.name} [{itemProps.dataItem.port}]</div> </div>;
		return React.cloneElement(li, li.props, itemChildren);
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect key='sensor-select'
					name='sensors'
					required={true}
					label="SENSOR(S)" 
					data={this.props.sensors}
					value={this.state.sensors}
					textField='name'
					dataItemKey='id'
					itemRender={this.itemRender}
					onChange={this.handleChange}/>
				<MultiSelect
					key='extract-select'
					name='extract'
					label="SENSOR EXTRACT"
					data={this.state.extracts}
					value={this.state.extract}
					textField='description'
					dataItemKey='id'
					onChange={this.handleChange}/>
				<DropDownList
					label="CHART TYPE" 
					name='graphType'
					data={[{text:'Line', value:'line'}, {text:'Bar', value:'column'}]}
					textField='text'
					dataItemKey='value'
					value={this.state.type}
					onChange={this.handleChange}/>
				<ColorSelect
					label="COLOR"
					name='graphColor'
					data={this.state.colors}
					value={this.state.color}
					onChange={this.handleChange}/>
				<Input
					required={true}
					name='graphName'
					label='LABEL'
					value={this.state.label}
					onChange={this.handleChange}/>
				<DropDownList
					label="PAW RANGE GUIDES" 
					name='paw_guides'
					data={[{text:'ON', value:true}, {text:'OFF', value:false}]}
					textField='text'
					dataItemKey='value'
					value={this.state.pawGuides}
					onChange={this.handleChange}/>
				<Input
					name='axis_min'
					label='AXIS MIN'
					value={this.state.axis_min}
					onChange={this.handleChange}/>
				<Input
					name='axis_max'
					label='AXIS MAX'
					value={this.state.axis_max}
					onChange={this.handleChange}/>


			</div>
		);
	}
}

class DegreeDaysForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red']
	    };
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect key='sensor-select'
					name='sensors'
					required={true}
					label="SENSOR(S)" 
					data={this.props.sensors}
					value={this.state.sensors}
					textField='name'
					dataItemKey='id'
					onChange={this.handleChange}/>
				<MultiSelect
					key='extract-select'
					name='extract'
					label="SENSOR EXTRACT"
					data={this.state.extracts}
					value={this.state.extract}
					textField='description'
					dataItemKey='id'
					onChange={this.handleChange}/>
				<NumericTextBox required={true} key='dd-input' label='THRESHOLD'/>
				<DropDownList label="TYPE" data={['Line', 'Bar']}	/>
				<ColorSelect label="COLOR" data={this.state.colors} />
				<Input required={true} key='label-input' label='LABEL'/>
			</div>
		);
	}
}

class PAWForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			graphName: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red'],
			sensors: [], 
			extracts:[],
			extract:null,
			'fc':null,
			'wp':null,
			paw_guides:false,
			pawGuides:null
	    };

	    this.setInitialValues = this.setInitialValues.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	}

	setInitialValues(){
		this.setState(this.props.initialValues);
		this.setState(this.props.options);
	}

	handleChange (event) {
		this.setState({
			[event.target.name] : event.target.name === 'graphType' || event.target.name === 'paw_guides' ? event.target.value.value :event.target.value,
			pawGuides: event.target.name === 'paw_guides' ? event.target.value: this.setState.pawGuides
		});

		if (event.target.name === 'sensors'){
			if (event.target.value.length > 0){
				fetch(`http://34.216.6.101:8000/extracts/${event.target.value[0].id}/`)
				.then(response => response.json())
				.then(extracts => {
					this.setState({
						extracts: extracts
					});
				});	
			}
		}
	}

	componentDidUpdate(){
		console.log(this.state);
		this.props.handleChange('paw', this.state);
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect key='sensor-select'
					name='sensors'
					required={true}
					label="SENSOR(S)" 
					data={this.props.sensors}
					value={this.state.sensors}
					textField='name'
					dataItemKey='id'
					onChange={this.handleChange}/>
				<MultiSelect
					key='extract-select'
					name='extract'
					label="SENSOR EXTRACT"
					data={this.state.extracts}
					value={this.state.extract}
					textField='description'
					dataItemKey='id'
					onChange={this.handleChange}/>
				<NumericTextBox
					name='fc'
					required={true}
					key='fc-input'
					label='FIELD CAPACITY'
					value={this.state.fc}
					onChange={this.handleChange}/>
				<NumericTextBox
					name='wp'
					required={true}
					key='wp-input'
					label='WILTING POINT'
					value={this.state.wp}
					onChange={this.handleChange}/>
				<DropDownList
					label="CHART TYPE" 
					name='graphType'
					data={[{text:'Line', value:'line'}, {text:'Bar', value:'column'}]}
					textField='text'
					dataItemKey='value'
					value={this.state.type}
					onChange={this.handleChange}/>
				<ColorSelect
					label="COLOR"
					name='graphColor'
					data={this.state.colors}
					value={this.state.color}
					onChange={this.handleChange}/>
				<Input
					required={true}
					name='graphName'
					label='LABEL'
					value={this.state.label}
					onChange={this.handleChange}/>
				<DropDownList
					label="PAW RANGE GUIDES" 
					name='paw_guides'
					data={[{text:'ON', value:true}, {text:'OFF', value:false}]}
					textField='text'
					dataItemKey='value'
					value={this.state.pawGuides}
					onChange={this.handleChange}/>
				<Input
					name='axis_min'
					label='AXIS MIN'
					value={this.state.axis_min}
					onChange={this.handleChange}/>
				<Input
					name='axis_max'
					label='AXIS MAX'
					value={this.state.axis_max}
					onChange={this.handleChange}/>
			</div>
		);
	}
}

class EToForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red']
	    };
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<DropDownList required={true} key='temp-select' label="TEMP"  data={['temp','moisture','humidity', 'water potential']}/>
				<DropDownList required={true} key='rh-select' label="RELATIVE HUMIDITY"  data={['temp','moisture','humidity', 'water potential']}/>
				<DropDownList required={true} key='sr-select' label="SOLAR RADIATION"  data={['temp','moisture','humidity', 'water potential']}/>
				<DropDownList required={true} key='ws-select' label="WIND SPEED"  data={['temp','moisture','humidity', 'water potential']}	/>
				<DropDownList label="TYPE"  data={['Line', 'Bar']}	/>
				<ColorSelect label="COLOR"  data={this.state.colors} />
				<Input required={true} label='LABEL'/>
			</div>
		);
	}
}

class DewPointForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red']
	    };
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect key='temp-select' required={true} label="TEMP"  data={['temp','moisture','humidity', 'water potential']}/>
				<MultiSelect key='rh-select' required={true} label="RELATIVE HUMIDITY"  data={['temp','moisture','humidity', 'water potential']}	/>
				<DropDownList label="TYPE"  data={['Line', 'Bar']}	/>
				<ColorSelect label="COLOR"  data={this.state.colors} />
				<Input required={true} label='LABEL'/>
			</div>
		);
	}
}

class SatExECForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red']
	    };
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect key='sensor-select' required={true} label="TEMP SENSOR"  data={['temp','moisture','humidity', 'water potential']}/>
				<MultiSelect key='extract-select' label="EXTRACT"  data={['temp','moisture','humidity', 'water potential']}	/>
				<NumericTextBox required={true} key='offset-input' label='OFFSET'/>
				<NumericTextBox required={true} key='saturation-input'label='SATURATION'/>
				<DropDownList label="TYPE" data={['Line', 'Bar']}	/>
				<ColorSelect label="COLOR" data={this.state.colors} />
				<Input required={true} key='label-input' label='LABEL'/>
			</div>
		);
	}
}

class CustomFormulaForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			colors: ['blue', 'lightblue', 'tomato', 'lime', 'green', 'lightgreen', 'skyblue', 'red']
	    };
	}

	render() {
		
		return(
			<div className='modal-form-inputs-wrap'>
				<MultiSelect required={true} label="SENSOR" data={['temp','moisture','humidity', 'water potential']}/>
				<MultiSelect label="EXTRACT" data={['temp','moisture','humidity', 'water potential']}	/>
				<Input required={true} key='formula-input' label='FORMULA' title='e.g. x^2 + 3*x + 1'/>
				<DropDownList label="TYPE" data={['Line', 'Bar']}	/>
				<ColorSelect label="COLOR" data={this.state.colors} />
				<Input required={true} key='label-input' label='LABEL'/>
			</div>
		);
	}
}

class ModalForm extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: '',
			calculation: 'Raw',
			editing:false,
			editingGraph:null,
			graphs:this.props.graphs.slice()
	    };
	    this.newGraph = null;
	    this.switchForm = this.switchForm.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	    this.addGraph = this.addGraph.bind(this);
	    this.removeGraph = this.removeGraph.bind(this);
	}

	calculations = ['Raw', 'PAW', 'Chill Portions', 'Degree Days', 'Chill Hours', 'ETo', 'Dew Point', 'Saturation ex EC', 'Custom Formula'];

	switchForm (e) {
		console.log('current form:', e.target.value);
		this.setState({
			calculation: e.target.value
		});
	}

	editGraph = (event) => {
		this.setState({
			editing:true,
			editingGraph:event.target.id
		});
	}

	handleChange (form, data) {
		let sensors = [];
		for (let i = 0; i < data.sensors.length; i++)
			sensors.push(data.sensors[i].id)
		let variables = [];
		if (form === 'paw')
			variables = [
				{variable:'fc',value:data.fc},
				{variable:'wp',value:data.wp}
			]

		let extract = null;
		if (data.extract !== null)
			if(data.extract.length > 0)
				extract = data.extract[0].id

	    this.newGraph = {
	      label:data.graphName,
	      calculation:form,
	      sensors:sensors,
	      extract :extract,
	      _type:data.graphType,
	      color:data.graphColor,
	      chart:this.props.chartId,
	      variables:variables,
	      fc:data.fc,
	      wp:data.wp,
	      paw_guides:data.paw_guides,
	      axis_min:data.axis_min,
	      axis_max:data.axis_max
	    };
	}

	addGraph () {
		let url = `http://34.216.6.101:8000/graphs/${this.props.chartId}/`,
		options = {
			method:'POST',
	        body:JSON.stringify(this.newGraph),
	        headers: {
	            "Content-Type": "application/json; charset=utf-8",
			}
		}

		fetch(url, options)
		.then(response => response.json())
		.then(graph => {
			let graphList = this.state.graphs.slice();
			let newGraph = {
                "id"      : graph.id,
                "title"   : graph.label,
                "type"    : graph._type,
                "color"   : graph.color,
			}
			graphList.push(newGraph);
			this.setState({graphs:graphList});
		});
	}

	removeGraph (graph) {
		let url = `http://34.216.6.101:8000/graph/${graph}/`,
		options = {
			method:'DELETE',
	        headers: {
	            "Content-Type": "application/json; charset=utf-8",
			}
		}

		fetch(url, options)
		.then(response => {
			let graphList = this.state.graphs.slice();
			let deletedGraph = null;
			for (let i = 0;i < graphList.length; i++){
				if (graphList[i].id === graph)
					deletedGraph = i
			}

			graphList.splice(deletedGraph, 1)

			this.setState({graphs:graphList});
		});
	}

	render(){

		let form;

		switch (this.state.calculation){
			case 'PAW':
				form = <PAWForm sensors={this.props.sensors} handleChange={this.handleChange} />;
				break;
			case 'Chill Portions':
				form = <RawSensorForm sensors={this.props.sensors}/>;
				break;
			case 'Chill Hours':
			case 'Degree Days':
				form = <DegreeDaysForm/>;
				break;
			case 'ETo':
				form = <EToForm/>;
				break;
			case 'Dew Point':
				form = <DewPointForm/>;
				break;
			case 'Saturation ex EC':
				form = <SatExECForm/>;
				break;
			case 'Custom Formula':
				form = <CustomFormulaForm/>;
				break;
			default:
				form = <RawSensorForm sensors={this.props.sensors} handleChange={this.handleChange}/>;
				break;
		}
			
		let graphs = this.state.graphs.map((graph) => {
			return (
					<GraphChip 
						type={graph.type}
						color={graph.lineColor}
						label={graph.title}
						key={graph.id}
						graphId={graph.id}
						remove={this.removeGraph}
					/>
				);
		});

        let chartTitle = this.props.chartTitle;
    	let dialog = this.props.visible &&
			<Dialog title={'Editing '+ chartTitle} onClose={this.props.close} className='edit-chart-dialog'>
				
				<div className='modal-wrap'>
					<div className='modal-form-wrap'>
						<DropDownList 
							label="CALCULATION"
							onChange={this.switchForm}
							data={this.calculations}
							value={this.state.calculation}
						 />
			            {form}
			            {!this.state.editing &&
				            <button 
				            	style={{marginTop:'15px'}}
				            	className="mdl-button mdl-js-button mdl-button--primary"
				            	onClick={this.addGraph}
				            >
							  Add New
							</button>
						}
			        </div>
			        <div className='modal-calendar-wrap'>
			        	<GraphChipContainer>
			        		{graphs}
			        	</GraphChipContainer>
			        	<DateRangePicker
			            	calendarSettings={{views:1}}
			            	popupSettings = {this.popupSettings}
			            />
			        </div>
		        </div>

                <DialogActionsBar>
                    <button className="k-button" onClick={this.props.close}>Cancel</button>
                    <button className="k-button" onClick={() => {this.props.updateChart('data')}}>Update</button>
                </DialogActionsBar>
            </Dialog>;
        return (dialog);
	}
}

export default ModalForm;
