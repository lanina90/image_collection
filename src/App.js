import React, {useEffect, useState} from 'react';
import './index.scss';
import Collection from "./components/Collection";


function App() {
  const ACCESS_KEY = '6q93maSPNJY-1onm30qZCdEF4TgO53QYrl6kPRCkqEI'
  const [collections, setCollections] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [tagsId, setTagsId] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1);
  const topics = ['Mountains', 'Europe trip', 'Architecture', 'Cities', 'Sea', 'Food', 'Outdoor']
  const categories = [
    {'name': 'All'},
    {'name': 'Mountains'},
    {'name': 'Sea'},
    {'name': 'Architecture'},
    {'name': 'Cities'}
  ]


  useEffect(() => {
    setIsLoading(true)

    const fetchPhotosByTopic = (topic, page) => {
      return fetch(`https://api.unsplash.com/search/photos?query=${topic}&per_page=10&page=${page}`, {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          return {
            topic,
            photos: data.results,
          };
        });
    };

    const selectedTopic = tagsId === 'All' ? topics : [tagsId];
    Promise.all(selectedTopic.map((topic) => fetchPhotosByTopic(topic)))
      .then((results) => {
        setCollections(results);
        console.log(results);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false))

  }, [tagsId, page]);

  return (
    <div className="App">
      <h1>My photo collection</h1>
      <div className="top">
        <ul className="tags">
          {
            categories.map((category) =>
              <li
                onClick={() => setTagsId(category.name)}
                className={tagsId === category.name ? 'active' : ''}
                key={category.name}>{category.name}
              </li>
            )
          }
        </ul>
        <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="search-input"
               placeholder="Поиск по названию"/>
      </div>
      <div className="content">
        {isLoading ? <h2>Loading...</h2> : collections
          .filter((collection) => collection.topic.toLowerCase().includes(inputValue.toLowerCase()))
          .slice((page - 1) * 3, page * 3)
          .map((collection) => (
            <Collection key={collection.topic}
                        name={collection.topic}
                        images={collection.photos.map((photo) => photo.urls.full)}
            />
          ))
        }

      </div>
      <ul className="pagination">
        {
          [...Array(5)].map((_, i) =>
            <li
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? 'active' : ''}>{i + 1}</li>
          )
        }
      </ul>
    </div>
  );
}

export default App;
