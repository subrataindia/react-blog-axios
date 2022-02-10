import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';

import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { format } from 'date-fns';
import api from './api/posts';

function App() {
  const [posts, setPosts] = useState([])  
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        if(response && response.data){
          setPosts(response.data);
        } 
      }catch(err){
        console.log(err.response.data)
      }
    }
    fetchPosts();
  },[])

  useEffect(() =>{
    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()));
    setSearchResults(filteredResults.reverse())
  },[posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody};
    try{
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/blog-app-axios') // Go to home page
    }catch(err){
      console.log(`Error: ${err.message}`);
    }
  }
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatePost = { id, title: editTitle, datetime, body: editBody};
    try{
      const response = await api.put(`posts/${id}`, updatePost);
      // If match post id pass the post data from response other wise pass currently exist post data
      setPosts(posts.map(post => post.id === id ? {...response.data} : post))
      setEditTitle('');
      setEditBody('');
      navigate('/blog-app-axios')
    }catch(err){
      console.log(err.message);
    }
  }

  const handleDelete = async (id) => {
    try{
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate(-1); // Go Back
    }catch(err){
      console.log(`Error: ${err.message}`);
    }
  }
  
  return (
    <div className="App">
        <Header title="React Blog - Using Axios API"/>
        <Nav search={search} setSearch={setSearch}/>
        <Routes>
          <Route exact path="/blog-app-axios" element={<Home posts={searchResults}/>} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/post" element={<NewPost handleSubmit = {handleSubmit} postTitle = {postTitle} setPostTitle = {setPostTitle} postBody = {postBody} setPostBody = {setPostBody}/>} />
          <Route exact path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
          <Route exact path="/edit/:id" element={<EditPost posts={posts} handleEdit = {handleEdit} editTitle = {editTitle} setEditTitle = {setEditTitle} editBody = {editBody} setEditBody = {setEditBody}/>} />
          <Route exact path="*" element={<Missing />} />
        </Routes>
        <Footer/>
    </div>
  );
}

export default App;
