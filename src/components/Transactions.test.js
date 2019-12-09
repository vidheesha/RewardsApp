import React from 'react';
import { shallow } from 'enzyme';
import Transactions from './Transactions';

const component = shallow(<Transactions/>);
const compIntance = component.instance();

describe('Transactions Component', () => {
    // Component Exits
    it("renders", () => {
      expect(component.exists()).toBe(true);
    });

    // Checking html table tag is present
    it('has a data table', () => {        
        var table = component.find('table');
        expect(table.length).toEqual(1);     
    });

    // Checking inital State
    it('Inital State', () => {        
        expect(component.state('transactionsData')).toBe(null);
        expect(component.state('yearsData')).toBe(null);
        expect(component.state('userData')).toBe(null);
        expect(component.state('selectedUser')).toBe('');
        expect(component.state('selectedYear')).toBe('');
        expect(component.state('selectedMonth')).toBe('');
        expect(component.state('searchResultsData')).toBe(null);
        expect(component.state('monthlyReward')).toBe(0);
        expect(component.state('totalReward')).toBe(0);
    });


    // Checking user action
    it("User Data input", () => {
      component.find("select[name='user']").simulate("change", {
        target: {value: "Joe"}
      });

      expect(component.find("select[name='user']").props().value).toEqual("Joe");
    });

    // Checking user action
    it("Year Data input", () => {
      component.find("select[name='year']").simulate("change", {
        target: {value: "2019"}
      });

      expect(component.find("select[name='year']").props().value).toEqual("2019");
    });

    // Checking user action
    it("Month Data input", () => {
      component.find("select[name='month']").simulate("change", {
        target: {value: "1"}
      });

      expect(component.find("select[name='month']").props().value).toEqual("1");
    });

    // mocking transaction data and checking fetch call
    describe('Fetch Data test', () => {
      it('fetches data from server when server returns a successful response', done => { 
          const mockSuccessResponse = {
              "Transaction":[
                {"firstName":"John", "lastName":"Doe", "store":"Walmart", "amountSpend":20, "date": "12/1/2019"}
              ]
          };
          const mockJsonPromise = Promise.resolve(mockSuccessResponse);
          const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
          });
          jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        
         const wrapper = shallow(<Transactions />);
                                
          expect(global.fetch).toHaveBeenCalledTimes(1);
          expect(global.fetch).toHaveBeenCalledWith('./data/data.json');
    
          process.nextTick(() => {
            expect(wrapper.state().transactionsData).toEqual({
              "Transaction":[
                {"firstName":"John", "lastName":"Doe", "store":"Walmart", "amountSpend":20, "date": "12/1/2019"}
              ]
          });    
          global.fetch.mockClear();
          done();
        });
      });
    });

    // Calculating Rewards test
    it("Calculate Rewards", () => {
        const rewardValue = compIntance.calculateRewards(60);
        expect(rewardValue).toEqual(10);
    })
  
});