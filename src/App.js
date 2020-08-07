import React, { Component } from 'react';
import Venue from './Venue'
import Modal from 'react-bootstrap/Modal'
import './App.css';

let clientId = 'AKTJEU40DEWSBOWVCPQ1XM3LSWMS5MLWTC1C3KSTSSBE3IDE';
let clientSecret = 'YSAVVV50BERZNEQLQXNWYXWNZYDEUKV4VDRT5IGZDLYEJR3E';
let clientKey = '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20200801'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      venues: [
        // {
        //   address: "1029 Tutanekai St",
        //   category: "Café",
        //   id: "57cb4710498ede2aea7ff9ab",
        //   name: "Terrace Kitchen",
        // }
      ],
      isModalOpen: false,
      modalVenue: {
        address: "321 Queen St.",
        category: "Comedy Club",
        description: "The Classic features local and international guest acts up to six nights a week. The main venue room can accommodate 140 people in comfortable cabaret-style seating, adjacent to a separate front bar. The Classic Studio upstairs can accomodate another 40 people in close up personal environment.",
        id: "4bcd4a98fb84c9b696e5213e",
        name: "The Classic",
        photo: "https://fastly.4sqi.net/img/general/300x300/2228306_-192mD5gFeLbj9A-wvjcriojIgGqZnKZlILSWPSNQrg.jpg",
      },
    }
  }

  openModal = () => {
    this.setState({
      isModalOpen: true,
    })
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  loadVenues = () => {
    let latlong = '-38.138781,176.239884'
    let url = 'https://api.foursquare.com/v2/venues/explore' + clientKey + '&ll=' + latlong


    fetch(url)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        return data.response.groups[0].items

      })
      .then((data) => {

        return data.map((item) => {
          let venue = {
            id: item.venue.id,
            name: item.venue.name,
            address: item.venue.location.address,
            category: item.venue.categories[0].shortName,
          }
          return venue;
        })
      })
      .then((data) => {
        this.setState({
          venues: data
        })
        console.log(data)
      })
  }

  loadVenue = (id) => {
    //let id = '4bcd4a98fb84c9b696e5213e'
    let url = 'https://api.foursquare.com/v2/venues/' + id + clientKey

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let item = data.response.venue
        //console.log(item)
        let venue = {
          id: item.id,
          name: item.name,
          category: item.categories[0].shortName,
          address: item.location.address,
          description: item.description,
          photo: item.bestPhoto.prefix + '300x300' + item.bestPhoto.suffix
        }
        return venue
      }).then(data => {
        console.log(data)
        this.setState({
          modalVenue: data,
        })
      })
  }

  componentDidMount() {
    this.loadVenues()
    //this.loadVenue()
  }

  render() {
    return (
      <div className="App">
        <div className="app">
          <div className="container">
            <div className="venues">
              {
                this.state.venues.map((item) => {
                  let venueProps = {
                    key: item.id,
                    ...item,
                    openModal: this.openModal,
                    loadVenue: this.loadVenue
                  }
                  return (
                    <Venue {...venueProps} />
                  )
                })
              }
            </div>

            <div className="venue-filters">

              <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <div role="group" className="btn-group btn-group-toggle">
                  <label className="venue-filter btn active btn-primary">
                    <input name="venue-filter" type="radio" autoComplete="off" value="all" checked="" />All
                </label>
                  <label className="venue-filter btn btn-primary">
                    <input name="venue-filter" type="radio" autoComplete="off" value="food" />Food
                </label>
                  <label className="venue-filter btn btn-primary">
                    <input name="venue-filter" type="radio" autoComplete="off" value="drinks" />Drinks
                </label>
                  <label className="venue-filter btn btn-primary">
                    <input name="venue-filter" type="radio" autoComplete="off" value="others" />Others
                </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal">
            <Modal show={this.state.isModalOpen} onHide={this.closeModal}>

              <Modal.Body>
                <div className="venue-popup-body row">
                  <div className="col-6">
                    <h1 className="venue-name">{this.state.modalVenue.name}</h1>
                    <p>{this.state.modalVenue.address}</p>
                    <p>Auckland</p>
                    <p><span className="badge venue-type">{this.state.modalVenue.category}</span></p>
                  </div>
                  <div className="col-6">
                    <img src={this.state.modalVenue.photo} className="img-fluid" alt="Responsive image" />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
          </div>

          <div className="modal" id="venue-modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">

                <div className="modal-body">

                  <div className="venue-popup-body row">
                    <div className="col-6">
                      <h1 className="venue-name">The Store</h1>
                      <p>5B Gore St</p>
                      <p>Auckland</p>
                      <p><span className="badge venue-type">Café</span></p>
                    </div>
                    <div className="col-6">
                      <img src="https://fastly.4sqi.net/img/general/200x200/194220_nI7vTqtIFQncbe7Zgn_XLymzqM78Cx-aZ_gySunjz-M.jpg" className="img-fluid" alt="Responsive image" />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
