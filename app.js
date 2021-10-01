
// Appliance class: represents Appliance record object
class Appliance {

	constructor(appliance, wattage, rate, perDay, perYear, energyUsedPerDay, energyUsedPerYear, costPerYear){
		this.id = Math.random();
		this.appliance = appliance,
		this.wattage = wattage,
		this.rate = rate,
		this.perDay = perDay,
		this.perYear = perYear,
		this.energyUsedPerDay = energyUsedPerDay,
		this.energyUsedPerYear = energyUsedPerYear,
		this.costPerYear = costPerYear
	}

}



// UI class: Handles UI Tasks
class UI {
		// method display appliance record on the ui table
		static displayAppliancesRecord() {

			const storedRecords = Store.getAppliances();

			// const storedRecords = [
			// 	{	
			// 		id:6446456556545,
			// 		appliance: "Pressing Iron",
			// 		wattage:"500",
			// 		rate: 0.5,
			// 		perDay:1,
			// 		perYear:200,
			// 		energyUsedPerDay: 300,
			// 		energyUsedPerYear:1000,
			// 		costPerYear:10000
			// 	},
			// 	{
			// 		id:6445687675445,
			// 		appliance: "Fridge",
			// 		wattage:"1000",
			// 		rate: 1.5,
			// 		perDay:10,
			// 		perYear:200,
			// 		energyUsedPerDay: 300,
			// 		energyUsedPerYear:1000,
			// 		costPerYear:10000
			// 	},

			// ];

			const appliances = storedRecords;
			// loop through stored records
			if(appliances.length){
				appliances.forEach((appliance, index) => UI.addAppliancesToList(appliance));
			}else{
				UI.tableAlert("No Data yet", 'danger');
			}
			
		}

		static tableAlert(message, className){
			const div = document.createElement('div');
			div.className =`alert alert-${className}`
			div.appendChild(document.createTextNode(message));

			const tableWrapper = document.querySelector(".output");
			const table = document.querySelector('#output-table');
			tableWrapper.insertBefore(div, table);

			// Vanish in 3seconds
			setTimeout(()=>{
				document.querySelector(".alert").remove();
			}, 5000)
		}

		static addAppliancesToList(appliance) {
			const list = document.querySelector('#output-record');

			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${appliance.appliance}</td>
				<td>${appliance.wattage}</td>
				<td>${appliance.rate}</td>
				<td>${appliance.perDay}</td>
				<td>${appliance.perYear}</td>
				<td>${appliance.energyUsedPerYear}</td>
				<td>${appliance.costPerYear}</td>
				<td><span class="delete">X</span></td>
				<td class='hideId'>${appliance.id}</td>
			`;
			// append row to list
			list.appendChild(row);
		}

		// delete appliance
		static deleteAppliance(el){
			if(el.classList.contains('delete')){
				el.parentElement.parentElement.remove();
			}
		}


		// show alert messages
		static showAlert(message,className){
			const div = document.createElement('div');
			div.className =`alert alert-${className}`
			div.appendChild(document.createTextNode(message));

			const form = document.querySelector("#submit-form");
			const action = document.querySelector('.action');
			form.insertBefore(div, action);

			// Vanish in 3seconds
			setTimeout(()=>{
				document.querySelector(".alert").remove();
			}, 2000)
		}



		// clear fields

		static clearFields(){
			document.querySelector("#appliance").value = "";
			document.querySelector("#wattage").value = "";
			document.querySelector("#rate").value = "";
			document.querySelector("#perDayUsed").value = "";
			document.querySelector("#perYearUsed").value = "";
		}
}


// Store class: Handles storage

class Store{
	static getAppliances(){
		let appliances;
		if(localStorage.getItem("appliances") === null){
			appliances = [];
		}else{
			appliances = JSON.parse(localStorage.getItem("appliances"));
		}

		return appliances;
	}

	static addAppliance(appliance){
		// get appliances array from store
		const appliances = Store.getAppliances();

		// push the new appliance into the appliances array
		appliances.push(appliance);

		// set items into lacal storege
		localStorage.setItem("appliances", JSON.stringify(appliances));
	}

	static removeAppliance(id){
		// get aplliances array from store
		const appliances = Store.getAppliances();



		// loop through array and slice out
		appliances.forEach((appliance, index) =>{

			console.log('appId',appliance.id)
			console.log('clientId', id)
			if(appliance.id == id){
				console.log('true')
				appliances.splice(index, 1);
			}
		});

		// set localstorage to update the store after removal
		localStorage.setItem('appliances', JSON.stringify(appliances));

	}
}


// Event: Display Appliance Record after calculation
// add record to UI as soon as page content loads
document.addEventListener('DOMContentLoaded', UI.displayAppliancesRecord);

// Event: Add Appliance from form
document.querySelector('#submit-form').addEventListener("submit", (e) =>{
	// prevent actual submit
	e.preventDefault();
	
	// get input values from form
	const appliance = document.querySelector("#appliance").value;
	const wattage = document.querySelector("#wattage").value;
	const rate = document.querySelector("#rate").value;
	const perDay = document.querySelector("#perDayUsed").value;
	const perYear = document.querySelector("#perYearUsed").value;

	if(appliance === '' || wattage === '' || rate === '' || perDay === '' || perYear === ''){
		UI.showAlert('Please fill all fields', 'danger');
		// alert('Please fill all fields', 'danger');
	}else{  
		// calculate energy used per day
	// (Wattage × Hours Used Per Day) ÷ 1000 
	const energyUsedPerDay = (wattage * perDay) / 1000;


	// calculate energy used per year
	// Daily kWh consumption × number of days used per year 
	const energyUsedPerYear = (energyUsedPerDay * perYear);

	// calculate cost per year
	// Annual energy consumption × utility rate per kWh
	const costPerYear = (energyUsedPerYear * rate);


	// instattiate new Apliance
	const createdAppliance = new Appliance(appliance,wattage, rate, perDay, perYear, energyUsedPerDay, energyUsedPerYear, costPerYear);
	
	// Add appliance to list
	UI.addAppliancesToList(createdAppliance);

	// Add to store
	Store.addAppliance(createdAppliance);

	// show success message
	UI.showAlert('Data added', 'success');

	// clear field
	UI.clearFields();
	}
})


// Event: Remove Appliance
document.querySelector("#output-record").addEventListener('click', (e)=>{
	
	// remove appliance from UI
	UI.deleteAppliance(e.target);

	// remove appliance from store
	 Store.removeAppliance(e.target.parentElement.nextElementSibling.textContent);

	// show success message
	UI.showAlert('Deleted', 'success');
})

