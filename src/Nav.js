import {Link} from 'react-router-dom';

const Nav = ({search, setSearch}) => {
  return (
    <nav className='Nav'>
      <form className='searchForm' onSubmit={(e) => e.preventDefault()}>
        <label htmlFor='searchForm'>Search Form</label>
        <input
          id="searchForm"
          type="text"
          placeholder='Search Form'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
      </form>
      <ul>
        <li><Link to="/blog-app-axios">Home</Link></li>
        <li><Link to="/post">Post</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Nav;