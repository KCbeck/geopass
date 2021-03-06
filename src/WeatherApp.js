import React from 'react';
// import logo from '.logo.svg';
import Form from "./app_component/form.component";
import'./App.css';
import Weather from './app_component/weather.component.jsx';
import 'weather-icons/css/weather-icons.min.css';
// git project https://github.com/erikflowers/weather-icons
import "weather-icons/css/weather-icons.css";
import API from './utils/API'
import moment from 'moment';
import './WheatherApp.css';
import keys from './keys';
import Note from './Note';
import ListNotes from './ListNotes'

const notesArray= [{id: 1, heading:'Note Uno', value:'This is a note'},
              {id: 2, heading:'Note Dos', value:'This is another note'},
              {id: 3, heading:'Note Tres', value:'This is the third note'}]


const weatherKey = keys.apiweather;



class WheatherApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        city: undefined,
        country: undefined,
        icon: undefined,
        main: undefined,
        celsius: undefined,
        temp_max: null,
        temp_min: null,
        description: "",
        todayArr: [],
        today: "",
        month: "",
        day: "",
        year: "",
        holidays: [],
        currentNote: null,
        notes: notesArray,
        error: false
      };
  
      this.weatherIcon = {
        Thunderstorm: "wi-thunderstorm",
        Drizzle: "wi-sleet",
        Rain: "wi-storm-showers",
        Snow: "wi-snow",
        Atmosphere: "wi-fog",
        Clear: "wi-day-sunny",
        Clouds: "wi-day-fog"
      };
    }
  
    get_WeatherIcon(icons, rangeId) {
      switch (true) {
        case rangeId >= 200 && rangeId < 232:
          this.setState({ icon: icons.Thunderstorm });
          break;
        case rangeId >= 300 && rangeId <= 321:
          this.setState({ icon: icons.Drizzle });
          break;
        case rangeId >= 500 && rangeId <= 521:
          this.setState({ icon: icons.Rain });
          break;
        case rangeId >= 600 && rangeId <= 622:
          this.setState({ icon: icons.Snow });
          break;
        case rangeId >= 701 && rangeId <= 781:
          this.setState({ icon: icons.Atmosphere });
          break;
        case rangeId === 800:
          this.setState({ icon: icons.Clear });
          break;
        case rangeId >= 801 && rangeId <= 804:
          this.setState({ icon: icons.Clouds });
          break;
        default:
          this.setState({ icon: icons.Clouds });
      }
    }
  
    calCelsius(temp) {
      let cell = Math.floor(temp - 273.15);
      return cell;
    }
  
    getWeather = async e => {
      e.preventDefault();
  
      const country = e.target.elements.country.value;
      const city = e.target.elements.city.value;
  
      if (country && city) {
        const api_call = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weatherKey}`
        );
  
        const response = await api_call.json();

        let today = moment().format('MM DD YYYY');
        let todayArr = today.split(' ');
        
      // let holidayCity = this.state.city;
      let holidayCountry = this.state.country;
      let holidayKey = keys.holiday;
      let queryString = 'https://calendarific.com/api/v2/holidays?&api_key='+holidayKey+'&country='
      +holidayCountry+'&month='+this.state.month+'&day='+this.state.day+'&year='+this.state.year;
      console.log(queryString);
      API.getHolidayInfo(queryString).then(response => this.setState ({holidays: response.data.response.holidays? response.data.response.holidays : "Not a Holiday"}))

        this.setState({
          city: `${response.name}, ${response.sys.country} `,
          country: response.sys.country,
          main: response.weather[0].main,
          celsius: this.calCelsius(response.main.temp),
          temp_max: this.calCelsius(response.main.temp_max),
          temp_min: this.calCelsius(response.main.temp_min),
          description: response.weather[0].description,
          today: moment().format('MM DD YYYY'),
          todayArr: today.split(' '), 
          month: todayArr[0],
          day: todayArr[1],
          year: todayArr[2], 
          error: false
        });
  
        // seting icons
        this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
  
        console.log(response);
      } else {
        this.setState({
          error: true
        });
      }
    }

      changeCurrentNote = (note) =>{

        this.setState({ currentNote: note })
      }
    
      deletenote = (note) =>{
    
    
        this.setState((state) => ({ notes: state.notes.filter(noteIterator => (noteIterator.id !== note.id)) }))
        this.setState({ currentNote: null })
    
    
      }
    
      saveNote = (note) =>{
    
        this.setState((state) => { state.notes.concat([note]) })
        this.setState({ currentNote: note })
    
      }
    
      addNew = () =>{
    
    
    
        const note = {id: this.state.notes.length + 1, heading: '', value: ' '}
        this.setState((state) => ({ notes: state.notes.concat([note]) }))
        this.setState({ currentNote: note })
    
    
    
      }
      

    

    // componentDidMount() {
    //   let today = moment().format('MM DD YYYY');
    //   let todayArr = today.split(' ');
    //   let month = todayArr[0];
    //   let day = todayArr[1];
    //   let year = todayArr[2]
    //   console.log("month:", month);
    //   console.log("day:", day);
    //   console.log("year", year);
    //   let city = this.state.city;
    //   let country = this.state.country;
    //   let key = keys.holiday;
    //   let queryString = 'https://calendarific.com/api/v2/holidays?&api_key='+key+'e109786119f75a638812ddfabaa96bf150902d3d&country='
    //   +country+'&month='+month+'&day='+day+'&year='+year;
    //   console.log(queryString);
    //   API.getHolidayInfo().then(response => console.log(response))
    // }
  
    render() {
      this.state.notes.sort((a, b) => {return b.id-a.id})
      return (
       
        <div className="App">
          <Form loadweather={this.getWeather} error={this.state.error} />
          <div class="whcard">
          <Weather 
            cityname={this.state.city}
            weatherIcon={this.state.icon}
            temp_celsius={this.state.celsius}
            temp_max={this.state.temp_max}
            temp_min={this.state.temp_min}
            description={this.state.description}
          />
        
          <div >
          </div>
            <br>
            </br>
         
          </div>
          <p class='holi'><h1> Date and Holiday</h1>{this.state.today}
          <div class="line"></div>{this.state.holidays}</p><p class="clock"><button className='add-note' onClick={this.addNew}>ADD/SAVE+</button>
        <div className='notes-wrapper'>
        <div className='list-notes-top'>
          <ListNotes notes={this.state.notes} changeCurrentNote={this.changeCurrentNote} deletenote={this.deletenote}/>
        </div>
        <div className='current-note'>
        {( this.state.currentNote !== null ) && ( <Note note={this.state.currentNote} savenote={this.saveNote}/> )}
        </div>

        </div></p>
        </div>
           
      );
    }
  }
  
  export default WheatherApp;
  
