import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  registerUser,
  registerUserWithService,
} from '../../actions/authActions';
import validate from '../../config/rules';
import logo from '../../TaskBarterLogo_Transparent.png';
import GoogleLogin from './subs/GoogleLogin';
import FacebookLogin from './subs/FacebookLogin';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      fname: '',
      sname: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      errMsg: '',
      isGoogleRef: false,
      isFacebookRef: false,
      authToken: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    const { name, email, ref, token } = this.getParams(this.props.location);
    if (ref === 'google' || ref === 'facebook') {
      const fname = name.split(' ')[0];
      const lname = name.split(' ')[1];
      this.setState({
        isGoogleRef: ref === 'google',
        isFacebookRef: ref === 'facebook',
        fname,
        sname: lname,
        email,
        authToken: token,
      });
    }

    document.getElementById('body').className = 'login-body';
    document.getElementById('html').className = 'login-html';
    this.setState({
      errors: {
        empty: 'The fields are empty',
      },
    });
  }

  getParams(location) {
    const searchParams = new URLSearchParams(location.search);
    return {
      name: searchParams.get('n') || '',
      token: searchParams.get('t') || '',
      ref: searchParams.get('ref') || '',
      email: searchParams.get('e') || '',
    };
  }

  componentWillUnmount() {
    if (localStorage.darkTheme) {
      document.getElementById('body').className = 'darktheme';
    } else {
      document.getElementById('body').className = '';
    }

    document.getElementById('html').className = '';
  }
  onChange = (e) => {
    if (validate(e.target.id, e.target.value.toLowerCase()) !== '') {
      document.getElementById(e.target.id).classList.add('is-invalid');
    } else {
      document.getElementById(e.target.id).classList.remove('is-invalid');
      document.getElementById(e.target.id).classList.add('is-valid');
    }
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    var regex = '';

    regex = /^[a-zA-Z ]{3,64}$/;
    if (!regex.test(this.state.fname) || !regex.test(this.state.sname)) {
      this.setState({
        errMsg: 'Your first or last name is not correct.',
      });
      return;
    }
    regex = /^[a-z0-9_-]{3,16}$/;
    if (!regex.test(this.state.name.toLowerCase())) {
      this.setState({
        errMsg: 'Your username is not correct.',
      });
      return;
    }
    regex = /.+@.+\.[A-Za-z]+$/;
    if (!regex.test(this.state.email)) {
      this.setState({
        errMsg: 'Your email address is not correct.',
      });
      return;
    }
    if (
      this.state.password === '' ||
      this.state.password2 === '' ||
      this.state.password.length < 6
    ) {
      this.setState({
        errMsg: 'Type in password of more than 6 characters to continue.',
      });
      return;
    }
    if (this.state.password.localeCompare(this.state.password2) !== 0) {
      this.setState({
        errMsg: 'Your both passwords must match.',
      });
      document.getElementById('password2').classList.add('is-invalid');
      return;
    }
    document.getElementById('password2').classList.remove('is-invalid');
    document.getElementById('password2').classList.add('is-valid');
    //ON SUCCESS:
    this.setState({
      errMsg: '',
    });
    const newUser = {
      name: this.state.name.trim().toLowerCase(),
      fname: this.state.fname.trim(),
      sname: this.state.sname.trim(),
      email: this.state.email.trim(),
      password: this.state.password,
      password2: this.state.password2,
    };
    this.setState({
      errors: {},
    });
    if (this.state.isGoogleRef || this.state.isFacebookRef) {
      newUser.token = this.state.authToken;
      newUser.isGoogleRef = this.state.isGoogleRef;
      newUser.isFacebookRef = this.state.isFacebookRef;
      this.props.registerUserWithService(newUser, this.props.history);
    } else {
      this.props.registerUser(newUser, this.props.history);
    }
  };

  render() {
    const { errors } = this.state;
    var isLoading = false;
    if (Object.entries(errors).length !== 0) {
      isLoading = false;
    } else {
      isLoading = true;
    }
    const loader = (
      <div className='lds-ring'>
        <div />
        <div />
        <div />
        <div />
      </div>
    );
    const errMsg =
      this.state.errMsg ||
      errors.name ||
      errors.email ||
      errors.password ||
      errors.password2 ||
      errors.errMsg;
    return (
      <div>
        <form className='form-signin' noValidate onSubmit={this.onSubmit}>
          <div className='text-center mb-4'>
            <Link to='/'>
              <img className='mb-4 login-logo' src={logo} alt='' />
            </Link>
          </div>
          {errMsg ? (
            <div className='alert alert-danger text-center'>
              <strong>Error: </strong> {errMsg}
            </div>
          ) : null}

          {this.state.isGoogleRef || this.state.isFacebookRef ? (
            <div className='alert alert-success text-center'>
              <strong>Success: </strong> Continue with other details to complete
              your registration.
            </div>
          ) : null}

          <div className='form-row'>
            <div className='form-label-group col'>
              <input
                type='text'
                id='fname'
                className='form-control'
                placeholder='First Name'
                required
                autoFocus={true}
                onChange={this.onChange}
                value={this.state.fname}
                error={errors.fname}
              />
              <label htmlFor='fname'> First Name</label>
            </div>
            <div className='form-label-group col'>
              <input
                type='text'
                id='sname'
                className='form-control'
                placeholder='Last Name'
                required
                autoFocus={true}
                onChange={this.onChange}
                value={this.state.sname}
                error={errors.sname}
              />
              <label htmlFor='sname'>Last Name</label>
            </div>
          </div>

          <div className='form-label-group'>
            <input
              type='text'
              id='name'
              className='form-control'
              placeholder='Username'
              required
              autoFocus={true}
              onChange={this.onChange}
              value={this.state.name}
              error={errors.name}
            />
            <label htmlFor='name'>Username</label>
          </div>

          <div className='form-label-group'>
            <input
              type='email'
              id='email'
              className='form-control'
              placeholder='Email address'
              required
              autoFocus={true}
              onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
              disabled={this.state.isGoogleRef || this.state.isFacebookRef}
            />
            <label htmlFor='email'>Email address</label>
          </div>

          <div className='form-label-group'>
            <input
              type='password'
              id='password'
              className='form-control'
              placeholder='Password'
              required
              onChange={this.onChange}
              value={this.state.password}
              error={errors.password}
            />
            <label htmlFor='password'>Password</label>
          </div>

          <div className='form-label-group'>
            <input
              type='password'
              id='password2'
              className='form-control'
              placeholder='Confirm Password'
              required
              onChange={this.onChange}
              value={this.state.password2}
              error={errors.password2}
            />
            <label htmlFor='password2'>Confirm Password</label>
          </div>

          <button
            className='btn btn-lg btn-primary btn-block login-btn'
            type='submit'
          >
            {this.state.isGoogleRef || this.state.isFacebookRef
              ? 'Complete Registration'
              : isLoading
              ? loader
              : 'Register'}
          </button>
          <br />
          <div className='mt-2 text-center login-links'>
            <Link to='/login'>Already have an account?</Link>
          </div>
          <div className='login-sep'>or</div>
          <div className='google-login'>
            <GoogleLogin />
            <FacebookLogin />
          </div>
          <p className='mt-4 mb-1 text-muted text-center'>
            Taskbarter &copy; 2020
          </p>
          <p className='mt-0 mb-3 text-muted text-center'>
            Your information is ensured to be kept in the most secure way
            possible. For more, visit our{' '}
            <Link to='/privacy-policy'>Privacy Policy</Link> page.
          </p>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  registerUser,
  registerUserWithService,
})(withRouter(Register));
