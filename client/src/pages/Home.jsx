import CarDetails from '../components/CarDetails'
import Car from '../components/Car'
import Search from '../components/Search'
import Nav from '../components/Nav'
import '../home.css'
import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
const Home = () => {
  const [cars, setCars] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searched, toggleSearched] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const getCars = async () => {
      try {
        const response = await axios.get(`https://freetestapi.com/api/v1/cars`)
        setCars(response.data)
      } catch (error) {
        console.error('Error fetching cars:', error)
      }
    }
    getCars()
  }, [])

  const getSearchResults = async (e) => {
    e.preventDefault()
    const response = await axios.get(
      `https://freetestapi.com/api/v1/cars?search=${searchValue}`
    )
    setSearchResults(response.data)
    toggleSearched(true)
    setSearchValue('')
  }
  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }
  return (
    <div className="homePage">
      <h1 className="homeHeader">welcome to our rental car project!</h1>
      <Nav />

      <Search
        value={searchValue}
        onChange={handleChange}
        onSubmit={getSearchResults}
      />

      {searched ? (
        <div className="search">
          <h2>Search Results : </h2>
          <section className="search-results-grid">
            {searchResults.map((data) => (
              <Car
                key={data.id}
                id={data.id}
                make={data.make}
                model={data.model}
                year={data.year}
                image={data.image}
                price={data.price}
                onClick={() => handleCarsClick(data.id)}
                //reviewslinkwillbeadded
              />
            ))}
          </section>
        </div>
      ) : (
        <div className="cars">
          <h2>NOT FOUND ! Please Try Again !</h2>
          <section className="container-grid">
            {cars.map((car) => (
              <Car
                key={car.id}
                id={car.id}
                make={car.make}
                model={car.model}
                year={car.year}
                image={car.image}
                price={car.price}
                onClick={() => handleCarsClick(car.id)}
                //reviewslinkwillbeadded
              />
            ))}
          </section>
        </div>
      )}
    </div>
  )
}

export default Home