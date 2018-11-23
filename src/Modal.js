import React from 'react';
import ReactDOM from 'react-dom';

const portalEl = document.body;

class Modal extends React.Component {
	constructor(props){
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		portalEl.appendChild(this.el);
	}

	componentWillUnmount() {
		portalEl.removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal (
			this.props.children,
			this.el
		);
	}
}

export default Modal;