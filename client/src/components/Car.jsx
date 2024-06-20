import { Link } from 'react-router-dom'

const Car = (props) => {
  const id = props.id
  return (
    <div>
      <Link to={`/car/${id}`}>
        <div className="card" onClick={props.onClick}>
          <div className="img-wrapper">
            <img src={props.image} alt={`${props.make}-${props.model}`} />
          </div>
          <div className="info-wrapper  flex-col">
            <h3>
              {props.make}
              {}
              {props.model}
            </h3>
            <p>
              <strong>{props.price}</strong>
            </p>
            <p>//reviews link to be added</p>
            <button onClick="">Rent</button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Car
