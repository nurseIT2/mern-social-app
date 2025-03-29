import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    searchQuery: '',
    sortBy: 'newest',
  };

  componentDidMount() {
    fetch('http://localhost:8080/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
    const socket = openSocket('http://localhost:8080');
    socket.on('posts', data => {
      if (data.action === 'create') {
        this.addPost(data.post);
      } else if (data.action === 'update') {
        this.updatePost(data.post);
      } else if (data.action === 'delete') {
        this.loadPosts();
      }
    });
  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift({
          ...post,
          imagePath: 'http://localhost:8080/' + post.imageUrl,
        });
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1,
      };
    });
  };

  updatePost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = {
          ...post,
          imagePath: 'http://localhost:8080/' + post.imageUrl,
        };
      }
      return {
        posts: updatedPosts,
      };
    });
  };

  loadPosts = direction => {
    if (direction) {
      this.setState(prevState => {
        const newPage = direction === 'next' ? prevState.postPage + 1 : prevState.postPage - 1;
        return { postPage: newPage, postsLoading: true };
      });
    }
    fetch('http://localhost:8080/feed/posts?page=' + this.state.postPage, {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          posts: resData.posts.map(post => ({
            ...post,
            imagePath: post.imageUrl ? 'http://localhost:8080/' + post.imageUrl : null,
          })),
          totalPosts: resData.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    fetch('http://localhost:8080/auth/status', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: this.state.status,
      }),
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true,
    });
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('image', postData.image);
    let url = 'http://localhost:8080/feed/post';
    let method = 'POST';
    if (this.state.editPost) {
      url = 'http://localhost:8080/feed/post/' + this.state.editPost._id;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt,
          imagePath: 'http://localhost:8080/' + resData.post.imageUrl,
        };
        this.setState(prevState => ({
          isEditing: false,
          editPost: null,
          editLoading: false,
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/feed/post/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  searchHandler = event => {
    this.setState({ searchQuery: event.target.value });
  };

  sortHandler = event => {
    this.setState({ sortBy: event.target.value });
  };

  filterAndSortPosts = () => {
    let filteredPosts = [...this.state.posts];
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
      );
    }
    switch (this.state.sortBy) {
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default: // newest
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filteredPosts;
  };

  renderPosts() {
    const filteredPosts = this.filterAndSortPosts();
    if (this.state.postsLoading) {
      return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Loader />
        </div>
      );
    }
    if (filteredPosts.length === 0) {
      return <p style={{ textAlign: 'center' }}>Посты не найдены</p>;
    }
    return (
      <Paginator
        onPrevious={this.loadPosts.bind(this, 'previous')}
        onNext={this.loadPosts.bind(this, 'next')}
        lastPage={Math.ceil(this.state.totalPosts / 3)}
        currentPage={this.state.postPage}
      >
        {filteredPosts.map(post => (
          <Post
            key={post._id}
            id={post._id}
            author={post.creator.name}
            date={new Date(post.createdAt).toLocaleDateString('ru-RU')}
            title={post.title}
            image={post.imagePath}
            content={post.content}
            onStartEdit={this.startEditPostHandler.bind(this, post._id)}
            onDelete={this.deletePostHandler.bind(this, post._id)}
          />
        ))}
      </Paginator>
    );
  }

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__controls">
          <div className="feed__search">
            <input
              type="text"
              placeholder="Поиск постов..."
              value={this.state.searchQuery}
              onChange={this.searchHandler}
              className="feed__search-input"
            />
            <select
              value={this.state.sortBy}
              onChange={this.sortHandler}
              className="feed__sort-select"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">Популярные</option>
            </select>
          </div>
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            Новый пост
          </Button>
        </section>
        <section className="feed">{this.renderPosts()}</section>
      </Fragment>
    );
  }
}

export default Feed;
