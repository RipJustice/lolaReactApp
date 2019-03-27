import React, { Component } from 'react';

class Seats extends Component {
	constructor(props) {
	    super(props);

	    this.state = {  
	    	seatInfo: [],  	
	    	clickState: null,
	    	dataRoute: 'https://s3.amazonaws.com/frontend-candidate-homework.lola.co/seats.json'
	    }	    
  	}

  	componentDidMount() {  		
		const proxyurl = "https://cors-anywhere.herokuapp.com/"; //using a proxy to get around the chrome local host cors request issue - can be removed when not running on local host	

	    fetch(proxyurl + this.state.dataRoute)	    
	    .then(res => res.json())    
	    .then(seatInfo => this.setState({seatInfo: seatInfo.sort((a, b) => ((a.seat < b.seat) ? -1 : (a.seat > b.seat) ? 1 : 0) || a.row - b.row).sort((a,b) => a.row - b.row)}));
	}	

	seatSelect(index) {
		this.setState({
	      clickState: index
	    });
	}

	selectColor(index) {
		if(this.state.clickState === index){
			return '#e83697';
		}else{
			return '';
		}
	}
	//return the unique letters for all seats in a particular cabin class
	firstClassAlpha(sarray, cabinclass) {
		const alpha1 = sarray.filter(seats => seats.class === cabinclass).map(seats => seats.seat),
		alpha2 = alpha1.sort().filter((value, index, self) => self.indexOf(value) === index);			

		return alpha2;	
	}

	//used to find the missing letters for seats to determine where the isle is when you compare this list to the seat letters
	fillAlpha(arr) {
		const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
		start = alpha.indexOf(arr[0]),
		end = alpha.indexOf(arr[arr.length-1]),
		sliced = alpha.slice(start, end + 1);

		console.log(arr[0]);
		console.log(arr[arr.length-1]);

		return sliced;
	}

	seatPop(sarray, cabinclass) {
		const seatLetters = this.firstClassAlpha(sarray, cabinclass),
		seatLettersFull = this.fillAlpha(seatLetters);

		let containWidth = seatLettersFull.length * (30 + 10);

		const build = sarray.filter(lola => lola.class === cabinclass).map((lola) => {			
				return(
					<div className="lolaSeats" key={lola.seat+lola.row} id={lola.seat+lola.row} data-color={(lola.occupied === true) ? "blue" : "grey"} onClick={this.seatSelect.bind(this, lola.seat+lola.row)} style={(lola.occupied === true) ? {backgroundColor: '#1b60e8'} : {backgroundColor: this.selectColor(lola.seat+lola.row)}}></div>
				);			
		});	 	
		
		//return seatLetters;
		return (
			<React.Fragment>
				<div className="lolaContained" style={{width: containWidth+"px"}}>		
				{build}
				</div>
			</React.Fragment>
		);
	}

	render(){		
		console.log(this.fillAlpha(this.firstClassAlpha(this.state.seatInfo, 'First')));			

		return(
			<div className="lolaSeatsContainer" key="lSeats1" id="lSeats1Cont">
				<div className="lolaFirstClass lolaRow">
					{this.seatPop(this.state.seatInfo, 'First')}
				</div>
				<div className="lolaBusClass lolaRow">
					{this.seatPop(this.state.seatInfo, 'Business')}					
				</div>
				<div className="lolaEcoClass lolaRow">
					{this.seatPop(this.state.seatInfo, 'Economy')}
				</div>							
			</div>
		);
	}
}

export default Seats;