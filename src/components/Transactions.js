import React from 'react';
import { createFilter } from '../utils/Filter';

export default class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionsData: null,
            yearsData: null,
            userData: null,
            selectedUser: '',
            selectedYear: '',
            selectedMonth: '',
            searchResultsData: null,
            monthlyReward: 0,
            totalReward: 0
        };    

        this.submit = this.submit.bind(this);
        this.calculateRewards = this.calculateRewards.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
    }
    componentDidMount() {
        var self = this;
        // Fetching transactions data from json file
        fetch('./data/data.json')
            .then((res) => res.json())
            .then((data) => {
                let i = 0,
                    allYears = [],
                    allUsers = [];
                for(i; data.Transaction.length > i; i++){
                    let year = data.Transaction[i].date.split('/')[2],
                        user = { firstName: data.Transaction[i].firstName, lastName: data.Transaction[i].lastName}
                        if(!allYears.includes(year)){
                            allYears.push(year)
                        }
                        allUsers.push(user);
                }
                self.setState({
                    transactionsData: data,
                    yearsData: allYears,
                    userData: self.getUnique(allUsers, 'firstName')
                });
        });
    }
    getUnique(arr,comp){
        const unique =  arr.map(e=> e[comp]).map((e,i,final) =>final.indexOf(e) === i && i) 
            .filter((e)=> arr[e]).map(e=>arr[e]);
        return unique
    }
    calculateRewards(amount){
        var rewardAmount = 0;
        if(amount > 100) {
            rewardAmount += ((amount - 100) * 2 + 50)
        } else if(amount > 50){
            rewardAmount += (amount - 50)
        }
        return rewardAmount;
    }
    onUserChange(event){
        this.setState({selectedUser: event.target.value});
    }
    onYearChange(event){
        this.setState({selectedYear: event.target.value});
    }
    onMonthChange(event){
        this.setState({selectedMonth: event.target.value});
    }
    submit(e){
        e.preventDefault();
        const {transactionsData, selectedUser, selectedMonth} = this.state;

        // To filter data based on user selection
        let filters = [{
                property: 'lastName',
                value: selectedUser
            },
            {   
                property: 'month',
                value: selectedMonth
            }],
            result = this.state.transactionsData.Transaction.filter(createFilter(...filters)),
            i = 0,
            reward = 0,
            j = 0,
            totReward = 0;
    
        // To Calculate Monthly Total Rewards
        for(i; result.length > i; i++){
            if(Number(result[i].amountSpend) > 0) {
                reward += this.calculateRewards(result[i].amountSpend)
            }            
        }

        // To Calculate Total User Rewards
        for(j; transactionsData.Transaction.length > j; j++){
            if( transactionsData.Transaction[j].lastName === selectedUser && Number(transactionsData.Transaction[j].amountSpend) > 0){
                console.log(transactionsData.Transaction[j].date, transactionsData.Transaction[j].amountSpend);
                totReward += this.calculateRewards(transactionsData.Transaction[j].amountSpend)
            }                       
        }
        // updating state with searched results    
        this.setState({
            searchResultsData: {
                Transaction: result                
            },
            totalReward: totReward,
            monthlyReward: reward
        });
    }
    render() {
        const {transactionsData, yearsData, userData, searchResultsData, monthlyReward, totalReward} = this.state;
        return (
            <div className="container">
                <form name="searchForm" className="mb-4" onSubmit={this.submit}>
                    <div className="form-row">
                        <div className="col-md-3 mb-2">
                            <label htmlFor="user" className="sr-only">Customer</label>
                            <select value={this.state.selectedUser} className="form-control" name="user" onChange={this.onUserChange}>
                                <option value="">Select User</option>
                                { userData && 
                                    userData.map((item, i) => {
                                        return [
                                            <option key={i} value={item.lastName}>{item.firstName}, {item.lastName}</option>
                                        ]
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3 mb-2">
                            <label htmlFor="year" className="sr-only">Year</label>
                            <select value={this.state.selectedYear} className="form-control" name="year" onChange={this.onYearChange}>
                                <option value="">Select Year</option>
                                { yearsData && 
                                    yearsData.map((item, i) => {
                                        return [
                                            <option key={i} value={item}>{item}</option>
                                        ]
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3 mb-2">
                            <label htmlFor="month" className="sr-only">Month</label>
                            <select value={this.state.selectedMonth} className="form-control" name="month" onChange={this.onMonthChange}>
                                <option value="">Select Month</option>
                                <option value="1">Jan</option>
                                <option value="2">Feb</option>
                                <option value="3">Mar</option>
                                <option value="4">Apr</option>
                                <option value="5">May</option>
                                <option value="6">Jun</option>
                                <option value="7">Jul</option>
                                <option value="8">Aug</option>
                                <option value="9">Sep</option>
                                <option value="10">Oct</option>
                                <option value="11">Nov</option>
                                <option value="12">Dec</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" disabled={ !this.state.selectedUser || !this.state.selectedYear || !this.state.selectedMonth } className="btn btn-primary btn-block mb-2">SUBMIT</button>
                        </div>
                    </div>                                        
                </form>
                

                { searchResultsData &&               
                    <p className="text-right"><strong>Total rewards: {totalReward}</strong></p>
                }
                <table className="table">
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Store</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Rewards</th>
                        </tr>
                    </thead>
                    <tbody>
                        { !searchResultsData && transactionsData && 
                            transactionsData.Transaction.map((item, i) => {
                                return [
                                    <tr key={i}>
                                        <td>{item.firstName}</td>                                    
                                        <td>{item.lastName}</td>
                                        <td>{item.store}</td>
                                        <td>{item.date}</td>
                                        <td>{item.amountSpend}</td>
                                        <td>{this.calculateRewards(item.amountSpend)}</td>
                                    </tr>
                                ]
                            })
                        }
                        
                        { searchResultsData &&
                            searchResultsData.Transaction.map((item, i) => {
                                return [
                                    <tr key={i}>
                                        <td>{item.firstName}</td>                                    
                                        <td>{item.lastName}</td>
                                        <td>{item.store}</td>
                                        <td>{item.date}</td>
                                        <td>{item.amountSpend}</td>
                                        <td>{this.calculateRewards(item.amountSpend)}</td>
                                    </tr>
                                ]
                            })
                        }
                        { searchResultsData &&               
                            <tr>
                                <td colSpan="5" align="right"><strong>Monthly reward</strong></td>
                                <td>{monthlyReward}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}