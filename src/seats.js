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

		//console.log(arr[0]);
		//console.log(arr[arr.length-1]);

		return sliced;
	}

	missingletter(str) {
		let missing = [], nums = str.map(function(letter){
			return letter.charCodeAt();
		})

		for(var i=0; i<nums.length; i++){
			if(nums[i+1] - nums[i] >1){
			  missing.push(String.fromCharCode(nums[i]+1))
			}
		}
		return missing
	}

	seatPop(sarray, cabinclass) {
		const seatLetters = this.firstClassAlpha(sarray, cabinclass),
		seatLettersMissing = this.missingletter(seatLetters),
		seatLettersFull = this.fillAlpha(seatLetters);

		let containWidth = seatLettersFull.length * (30 + 10),
		topLetter = [];		

		for (let i = 0; i < seatLettersFull.length; i++){
			for (let t = 0; t < seatLettersMissing.length; t++){				
				if (seatLettersFull[i] === seatLettersMissing[t]){
					topLetter.push("space");
				}else{
					topLetter.push(seatLettersFull[i]);
				}
			}
		}			

		topLetter = topLetter.filter((value, index, self) => (value !== "space") ? self.indexOf(value) === index : value);		

		for (let p = 0; p < topLetter.length; p++) {
			for (let t = 0; t < seatLettersMissing.length; t++){
				if (topLetter[p] === seatLettersMissing[t]){
					topLetter.splice(p, 1);
				}
			}
		}


		const TopRow = topLetter.map((val, index) => {					
			if (val !== "space"){
				return(
					<div className="lolaSeats" key={val+index}>{val}</div>
				);
				
			}else{
				return(
					<div className="lolaSeats" key={val+index}></div>
				);
				
			}			
		});

		const build = sarray.filter(lola => lola.class === cabinclass).map(lola => {			
				return(
					<div className="lolaSeats" key={lola.seat+lola.row} id={lola.seat+lola.row} data-color={(lola.occupied === true) ? "blue" : "grey"} onClick={this.seatSelect.bind(this, lola.seat+lola.row)} style={(lola.occupied === true) ? {backgroundColor: '#1b60e8'} : {backgroundColor: this.selectColor(lola.seat+lola.row)}}></div>
				);			
		});	
		

		return (
			<React.Fragment>
				<div className="lolaContained" style={{width: containWidth+"px"}}>		
				{TopRow}
				{build}
				</div>
			</React.Fragment>
		);
	}

	render(){		
		console.log(this.missingletter(this.firstClassAlpha(this.state.seatInfo, 'First')));			

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