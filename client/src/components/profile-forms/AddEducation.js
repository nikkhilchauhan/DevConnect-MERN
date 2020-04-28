import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e) => {
    setFormData({ ...formData, [e.target.name]: !current });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-graduation-cap'></i> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small>* = required field</small>
      <form onSubmit={(e) => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            onChange={(e) => {
              onChange(e);
            }}
            value={school}
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => {
              onChange(e);
            }}
            value={degree}
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => {
              onChange(e);
            }}
            value={fieldofstudy}
            type='text'
            placeholder='Field Of Study'
            name='fieldofstudy'
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            onChange={(e) => {
              onChange(e);
            }}
            value={from}
            type='date'
            name='from'
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              onChange={(e) => handleCheckBox(e)}
              defaultChecked={current}
              value={current}
              type='checkbox'
              name='current'
            />{' '}
            Current School or Bootcamp
          </p>
        </div>

        {!current ? (
          <div className='form-group'>
            <h4>To Date</h4>
            <input type='date' name='to' />
          </div>
        ) : null}
        <div className='form-group'>
          <textarea
            onChange={(e) => {
              onChange(e);
            }}
            value={description}
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
          ></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link
          to='/dashboard'
          className='btn btn-light my-1'
          href='dashboard.html'
        >
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
// });

export default connect(null, { addEducation })(withRouter(AddEducation));
