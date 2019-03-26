import React, { Component } from 'react';

class Seats extends Component {
	constructor(props) {
	    super(props);

	    this.state = {  
	    	seatInfo: [],  	
	    	dataRoute: 'https://s3.amazonaws.com/frontend-candidate-homework.lola.co/seats.json'
	    }
  	}

  	componentDidMount() {  		
		const proxyurl = "https://cors-anywhere.herokuapp.com/"; //using a proxy to get around the chrome local host cors request issue - can be removed when not running on local host	

	    fetch(proxyurl + this.state.dataRoute)	    
	    .then(res => res.json())    
	    .then(seatInfo => this.setState({seatInfo: seatInfo.sort((a, b) => ((a.seat < b.seat) ? -1 : (a.seat > b.seat) ? 1 : 0) || a.row - b.row).sort((a,b) => a.row - b.row)}));
	}	

	//return the unique letters for all seats in a particular cabin class
	firstClassAlpha(sarray, cabinclass) {
		let alpha1 = [],
		alpha2 = [];

		sarray.filter(seats => {
			if (seats.class === cabinclass) {
				alpha1.push(seats.seat);
			}
		});
		
		alpha1.sort().filter((value, index, self) => {
			if (self.indexOf(value) === index){
				alpha2.push(value);
			}
		});

		return alpha2;		

	}

	//used to find the missing letters for seats to determine where the isle is when you compare this list to the seat letters
	fillAlpha(arr) {
		const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
		start = alpha.indexOf(arr[0]),
		end = alpha.indexOf(arr[arr.length-1]),
		sliced = alpha.slice(start, end + 1);

		return sliced;
	}

	seatPop(sarray, cabinclass) {
		const seatLetters = this.firstClassAlpha(sarray, cabinclass);
		const seatLettersFull = this.fillAlpha(seatLetters);

		const build = sarray.map((lola) => {
			if (lola.class === cabinclass) {
				return(
					<div className="lolaSeats" key={lola.seat+lola.row} id={lola.seat+lola.row+lola.occupied} style={(lola.occupied === true) ? {backgroundColor: "#1b60e8"} : {backgroundColor: "#dcdddf"}}></div>
				);
			}
		});		
		
		//return seatLetters;
		return (
			<React.Fragment>
				{seatLetters}	
				{seatLettersFull}		
				{build}
			</React.Fragment>
		);
	}

	render(){		

		console.log(this.firstClassAlpha(this.state.seatInfo, 'First'));
		console.log(this.fillAlpha(this.firstClassAlpha(this.state.seatInfo, 'First')));
		//console.log(this.seatPop(this.state.seatInfo, 'First'));		

		return(
			<div className="lolaSeatsContainer" key="lSeats1" id="lSeats1Cont">
				<div className="lolaFirstClass lolaContained">
					{this.seatPop(this.state.seatInfo, 'First')}
				</div>
				<div className="lolaBusClass lolaContained">
					
				</div>
				<div className="lolaEcoClass lolaContained">

				</div>							
			</div>
		);
	}
}

export default Seats;