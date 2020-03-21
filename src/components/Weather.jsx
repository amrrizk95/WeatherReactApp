import React from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';
import axios from 'axios';
import OSM from 'ol/source/OSM';
import Header from './header'
import { Map,  View} from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import {Tile as TileLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
  import Modal from 'react-modal';
import Grid from '@material-ui/core/Grid';
import 'openlayers/css/ol.css'
import './weather.scss'
var TrieSearch = require('trie-search');
const { Option } = Select;
let map;


var vectorSource = new VectorSource({});
var style = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 1
  }),
  fill: new Fill({
    color: 'rgba(255,0,0,0.1)'
  })

});
class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.fetchingCities = this.fetchingCities.bind(this)
    this.updateDimensions=this.updateDimensions.bind(this)
    this.changJsonToFeaturLayer=this.changJsonToFeaturLayer.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      name: '',
      height:'',
      optionsList: [],
      features: [],
      properties: [],
      geometry: [],
      names: [],
      data: [],
        temperature:'',
        wind_speed:'',
        pressure:'',
        weather_descriptions:'',

 
      selectedFeature: {},
      modalIsOpen: undefined
    };
  }
  updateDimensions(){
    const h = window.innerWidth >= 992 ? window.innerHeight : 660
    this.setState({height: h})
    }
    componentWillMount(){
      window.addEventListener('resize', this.updateDimensions)
     this.updateDimensions()
  }
  componentDidMount() {
    this.fetchingCities();
     map = new Map({
       
      target: 'map',
      layers: [
          new TileLayer({
              source: new OSM()
            }),
            new VectorLayer({
              source: vectorSource,
              style:style
          })
       
              
      ],
      view: new View({
          projection: 'EPSG:3857',
          center: [0, 0],
          zoom: 4
      })
  })

  }
  fetchingCities() {
    let tempNames = []
    let tempProp = []
    let tempGeometry = []
    axios.get('https://raw.githubusercontent.com/drei01/geojson-world-cities/master/cities.geojson')
      .then((res) => {
        this.setState({ features: res.data.features })
      }).then(() => this.state.features.map((f) => {
        tempProp.push(f.properties);
        tempNames.push(f.properties["NAME"])
        tempGeometry.push(f.geometry);
      })).then(() => this.setState({ properties: tempProp, geometry: tempGeometry, names: tempNames }))
  }

  converToLowerCase(arr) {
    let tempArr = []
    for (let i = 0; i < arr.length; i++) {
      if (!!arr[i] && typeof arr[i] === 'string') {
        tempArr.push(arr[i].toLowerCase())
      }
    }
    return tempArr;
  }

  changJsonToFeaturLayer(jsonFeature,cb){
    var geojsonFormat = new GeoJSON({dataProjection:'EPSG:4326',featureProjection:'EPSG:3857'});
    var features = geojsonFormat.readFeatures(jsonFeature);
    cb(features)
     
  }
  onChange = value => {
    let self = this
    this.setState({ selectedFeature: this.state.data[value] },
      ()=>this.changJsonToFeaturLayer(this.state.selectedFeature,
        (feature)=>{
          //console.log(feature[0].getGeometry().getCoordinates()[0])
          vectorSource.addFeature(feature[0]) 
            const extent = feature[0].getGeometry().getExtent()
            map.getView().fit(extent);
            map.on('click',function(e){
              //console.log(e)
              let cityName=feature[0].values_.NAME.toLowerCase();
              const params = {
                access_key: 'abb8ec2560cd5fddc8e0b950d4e6f458',
                query: `${cityName}`
              }
              axios.get(`http://api.weatherstack.com/current`,{params})
              .then(res=>self.setState({
                temperature:res.data.current.temperature,
                wind_speed:res.data.current.wind_speed,
                pressure:res.data.current.pressure,
                weather_descriptions:res.data.current.weather_descriptions
              },()=>console.log(self.state.weather ))).then(self.openModal)
              
            })
            
    }))
  }

  handleSearch = query => {
    var ts = new TrieSearch([
      ['properties', 'NAME'] // `Search properties.NAME`
    ]);
    ts.addAll(this.state.features);
    let data = ts.get(query);
    this.setState({ data })
  }
  closeModal() {
    this.setState({modalIsOpen: undefined});
  }
  openModal() {
    this.setState({modalIsOpen: true});
    
  }
 


  render() {
    const style = {
      width: '100%',
      height:this.state.height,
      backgroundColor:  'rgba(50, 115, 220, 0.3)',
      backgroundColor:  '#777B7E',
      //backgroundColor:  '#2E3B55',
      
  }
    return (
      <Grid item xs={12}>
       
      <div id='map' style={style}  >
        <Select
          size="large"
          showSearch
          style={{ width: 200 }}
          placeholder="Select a city"
          optionFilterProp="children"
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.handleSearch}
          autoClearSearchValue 
        >
          {this.state.data.slice(0,50).map((item, index) => (<Option key={index}>{item.properties.NAME}</Option>))}
        </Select>
                      
      </div>
      <Modal
      
      className="previewWeather"
      closeTimeoutMS={200}
      isOpen={this.state.modalIsOpen}
      onAfterOpen={this.afterOpenModal}
      onRequestClose={this.closeModal}

      >   
     <div className="modal__title">
        <h3 className="modal__title__h3">Weather Status</h3>
        {this.state.name}
    </div>
                        
    <div className="modal__body">

            <div className="modal__lable">
              <label> Temperature: </label> <span> </span> 
              {this.state.temperature} dgree</div>

            <div className="modal__lable">
              <label> Wind Speed:</label> <span> </span> 
              {this.state.wind_speed} mph</div>

            <div className="modal__lable">
              <label> Pressure:</label> <span> </span> 
              {this.state.pressure} mb </div>
            <div className="modal__lable">
              <label> Descriptions:</label> <span> </span> 
              {this.state.weather_descriptions[0]} </div> 

    </div>
    <div className="modal-footer">
       <button onClick={this.closeModal} className="btn btn-secondary">Close</button>   
     </div>
      </Modal>
      </Grid>
    );
  }
}
export default Weather;