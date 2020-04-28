import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import {
  getCurrentProfile,
  deleteExperience,
  deleteEducation,
  deleteProfile,
} from '../../actions/profile';
import DashboardActions from './DashboardActions';

const Dashboard = ({
  auth: { user },
  profile: { profile, loading },
  getCurrentProfile,
  deleteExperience,
  deleteEducation,
  deleteProfile,
}) => {
  useEffect(() => {
    document.title = 'Devconnect | Dashboard';
    getCurrentProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <h2 className='my-2'>Experience Credentials</h2>
          <table className='table'>
            <thead>
              <tr>
                <th>Company</th>
                <th className='hide-sm'>Title</th>
                <th className='hide-sm'>Years</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {profile.experience &&
                profile.experience.map((exp) => {
                  return (
                    <tr key={exp._id}>
                      <td>{exp.company}</td>
                      <td className='hide-sm'>{exp.title}</td>
                      <td className='hide-sm'>
                        <Moment format='YYYY/MM/DD'>{exp.from}</Moment>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteExperience(exp._id)}
                          className='btn btn-danger'
                        >
                          <i className='far fa-trash-alt'></i> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <h2 className='my-2'>Education Credentials</h2>
          <table className='table'>
            <thead>
              <tr>
                <th>School</th>
                <th className='hide-sm'>Degree</th>
                <th className='hide-sm'>Years</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {profile.education &&
                profile.education.map((edu) => {
                  return (
                    <tr key={edu._id}>
                      <td>{edu.school}</td>
                      <td className='hide-sm'>{edu.degree}</td>
                      <td className='hide-sm'>
                        <Moment format='YYYY/MM/DD'>{edu.from}</Moment>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteEducation(edu._id)}
                          className='btn btn-danger'
                        >
                          <i className='far fa-trash-alt'></i> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Fragment>
      ) : (
        <Fragment>
          <p className='lead'>
            You have not setup a profile, please add some info.
          </p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            <i className='fas fa-user-circle text-white'></i> Create Profile
          </Link>
        </Fragment>
      )}
      <div className='my-2'>
        <button onClick={() => deleteProfile()} on className='btn btn-danger'>
          <i className='fas fa-user-minus'></i> Delete My Account
        </button>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteExperience: PropTypes.func.isRequired,
  deleteEducation: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteExperience,
  deleteEducation,
  deleteProfile,
})(Dashboard);
