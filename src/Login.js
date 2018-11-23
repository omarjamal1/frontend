import React, { Component } from 'react';
import { Input } from '@progress/kendo-react-inputs';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:''
    };

    this.login = this.login.bind(this);
    this.handlChange = this.handlChange.bind(this);
  }

  login = () => {

  	this.props.login(this.state);

  }

  handlChange = (event) => {
  		this.setState({
  			[event.target.name]: event.target.value
  		});
  }

  componetDidUpdate(){
  	console.log(this.state);
  }

  render() {
    return (

        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
		  <main className="mdl-layout__content">
		    <div className="page-content"  >
		    	
		    	<div className="mdl-grid">
		    		
		    		<div className="mdl-cell mdl-cell--12-col mdl-cell--8-tablet mdl-cell--4-phone">
		    			
		    			<div className="login-card mdl-card mdl-shadow--2dp">
						    <h2 className="mdl-card__title-text">Login</h2>
					    			<div style={{color:'red'}}> 
					    			
					    			</div>


							  <div className="mdl-textfield mdl-js-textfield">
							    
							    	<Input value={this.username} onChange={this.handlChange} name='username' label='USERNAME'/>
							  </div>
							  <div className="mdl-textfield mdl-js-textfield">
							    	<Input value={this.username} onChange={this.handlChange} name='password' type={'password'} label='PASWORD'/>
							    
							  </div>
						    
						  <div className="mdl-card__supporting-text">

						  </div>
						  <div className="mdl-card__actions mdl-card--border">
						    <a href="/create_account/" className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
						      Sign Up
						    </a>
						    <div className="mdl-layout-spacer">
						    </div>
						    <a onClick={this.login} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
						      Login
						    </a>
						  </div>
						</div>

		    		</div>

		    	</div>

		    </div>
		  </main>
		</div>

      );
  }
}

export default Login;
