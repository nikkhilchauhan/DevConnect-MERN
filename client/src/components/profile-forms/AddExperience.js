import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addExperience } from '../../actions/profile';

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const { title, company, location, from, to, current, description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e) => {
    setFormData({ ...formData, [e.target.name]: !current });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addExperience(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
        className='form'
      >
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            value={title}
            type='text'
            placeholder='* Job Title'
            name='title'
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            value={company}
            type='text'
            placeholder='* Company'
            name='company'
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            value={location}
            type='text'
            placeholder='Location'
            name='location'
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            onChange={(e) => onChange(e)}
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
            Current Job
          </p>
        </div>
        {current ? null : (
          <div className='form-group'>
            <h4>To Date</h4>
            <input
              onChange={(e) => onChange(e)}
              value={to}
              type='date'
              name='to'
            />
          </div>
        )}
        <div className='form-group'>
          <textarea
            onChange={(e) => onChange(e)}
            value={description}
            name='description'
            cols='30'
            rows='5'
            placeholder='Job Description'
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
      <div>{JSON.stringify(formData)}</div>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
// });

export default connect(null, { addExperience })(withRouter(AddExperience));
