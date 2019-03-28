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

	//passing indexes in for the state value here
	seatSelect(index) {
		this.setState({
	      clickState: index
	    });
	}

	//using the index value passed to our state with the above method to control what element gets a color change on click
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
		fullAlpha = alpha.slice(start, end + 1);		

		return fullAlpha;
	}

	//return the missing letters from an array only
	missingLetters(arr) {
		let missing = [], 
		unicode = arr.map((letter) => {
			return letter.charCodeAt();
		});

		for(let i = 0; i < unicode.length; i++){
			if(unicode[i + 1] - unicode[i] > 1){
				missing.push(String.fromCharCode(unicode[i] + 1));
			}
		}

		return missing
	}

	seatPop(sarray, cabinclass) {
		const seatLetters = this.firstClassAlpha(sarray, cabinclass),
		seatLettersMissing = this.missingLetters(seatLetters),
		//here we are taking the seats array and swapping all seat letters to unicode
		lolaUnicode = sarray.filter(lola => lola.class === cabinclass).map(lol => ({...lol, seat: lol.seat.charCodeAt()}));

		let seatLettersFull = this.fillAlpha(seatLetters),
		//sets width of container based on the length of the full alphabet slice array in combination with the width and margin of each seat's visual representation
		containWidth = seatLettersFull.length * (30 + 10),
		finUnArray = [];		

		//Here we are looping through our full alphabet array against the seat letters that should be missing then modding our full alphabet array in preparation for using it to create our top column letters section
		for (let i = 0; i < seatLettersFull.length; i++){
			for (let t = 0; t < seatLettersMissing.length; t++){				
				if (seatLettersFull[i] === seatLettersMissing[t]){
					seatLettersFull[i] = "space";
				}			
			}			
		}

		//Here we take our modded full alphabet array to produce the html needed for our top column letters section
		const TopRow = seatLettersFull.map((val, index) => {					
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
		
		//here we are looping through our array version that has unicode seats, comparing the unicode characters to determine how to build the array we'll be using to produce the seats and rows. The unicode is specifically to determine row placement
		for(let i = 0; i < lolaUnicode.length; i++){//			
			if(i < lolaUnicode.length -1) {//doing array length - 1 as the unicode logic expects to be able to compare the current array object property to the next and can't do so at the end of the array plus there are no rows at the end of the array
				if((lolaUnicode[i + 1]["seat"] - lolaUnicode[i]["seat"]) > 1){//if we find where a row should be, add the array object to the new array then add a row object right after
					finUnArray.push(lolaUnicode[i]);

					let obj = {
					    "seat": "space",
					    "row":  lolaUnicode[i]["row"],
					    "class": lolaUnicode[i]["class"]+i,
					    "occupied": false
					};

					finUnArray.push(obj);
				}else{
					finUnArray.push(lolaUnicode[i]);
				}
			}else{//push the final array object into the new array
				finUnArray.push(lolaUnicode[i]);
			}
		}		

		const build = finUnArray.map(lola => {	//we're now using our final array with row objects included to generate our visual interface			
				if(lola.seat === "space"){
					return(
						<div className="lolaSeats" key={lola.seat+lola.row+lola.class}>{lola.row}</div>
					);
				}else{
					return(
						<div className={(lola.occupied === true) ? "lolaSeats" : "lolaSeats lolaSelect"} key={String.fromCharCode(lola.seat)+lola.row} id={String.fromCharCode(lola.seat)+lola.row} data-color={(lola.occupied === true) ? "blue" : "grey"} onClick={this.seatSelect.bind(this, String.fromCharCode(lola.seat)+lola.row)} style={(lola.occupied === true) ? {backgroundColor: '#1b60e8'} : {backgroundColor: this.selectColor(String.fromCharCode(lola.seat)+lola.row)}}></div>
					);	
				}		
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