import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getCurrentProfile,
  updateProfile,
  updateStatus,
  addExperience,
  addProject,
  addSkill,
} from '../../actions/profileAction';
import '../../style/profile/profile_page.css';
import FirstBlock from './subs/FirstBlock';
import SecondBlock from './subs/SecondBlock';
import ThirdBlock from './subs/ThirdBlock';
import StatusBlock from './subs/StatusBlock';
import SkillsBlock from './subs/SkillsBlock';
import LinksBlock from './subs/LinksBlock';
import EditFirst from './edit/EditFirst';
import AddSecond from './edit/AddSecond';
import AddThird from './edit/AddThird';
import AddSkills from './edit/AddSkills';

class Me extends Component {
  constructor(props) {
    super();
    this.state = {
      isFirstEditDialogOpenned: false,
      isSecondAddDialogOpenned: false,
      isThirdAddDialogOpenned: false,
      isSkillAddDialogOpenned: false,
      current_dob: new Date('October 4, 1997 11:13:00'),
      isCurrentlyWorking: false,
      current_from: new Date('October 4, 2019 11:13:00'),
      current_to: new Date(),
    };
  }
  componentDidMount() {
    this.props.getCurrentProfile().then(() => {
      this.setState({
        current_dob: this.props.profile.profile.dob,
      });
    });
  }

  toggleCurrentlyWorking = () => {
    const tempCur = this.state.isCurrentlyWorking;
    this.setState({
      isCurrentlyWorking: !tempCur,
    });
  };

  openFirstModal = () => {
    if (!isNaN(this.props.profile.profile.dob)) {
      this.setState({
        isFirstEditDialogOpenned: true,
        current_dob: new Date(this.props.profile.profile.dob),
      });
    } else {
      this.setState({
        isFirstEditDialogOpenned: true,
        current_dob: new Date(this.props.profile.profile.dob),
      });
    }
  };

  addSecondModal = () => {
    this.setState({
      isSecondAddDialogOpenned: true,
    });
  };

  addThirdModal = () => {
    this.setState({
      isThirdAddDialogOpenned: true,
    });
  };

  addSkillModal = () => {
    this.setState({
      isSkillAddDialogOpenned: true,
    });
  };

  onProfileUpdateSecond = (data) => {
    this.props.addExperience(data);
    this.closeSecondAddDialog();
  };

  onProfileUpdateThird = (data) => {
    this.props.addProject(data);
    this.closeThirdAddDialog();
  };

  onProfileUpdateSkill = (data) => {
    this.props.addSkill(data);
    this.closeSkillAddDialog();
  };

  closeFirstEditDialog = () => {
    this.setState({ isFirstEditDialogOpenned: false });
  };

  closeSecondAddDialog = () => {
    this.setState({ isSecondAddDialogOpenned: false });
  };

  closeThirdAddDialog = () => {
    this.setState({ isThirdAddDialogOpenned: false });
  };

  closeSkillAddDialog = () => {
    this.setState({ isSkillAddDialogOpenned: false });
  };

  onDoBChange = (d) => {
    this.setState({
      current_dob: d,
    });
  };

  onFromChanged = (d) => {
    this.setState({
      current_from: d,
    });
  };

  onToChanged = (d) => {
    this.setState({
      current_to: d,
    });
  };

  onProfileUpdateFirst = (payload) => {
    this.props.updateProfile(payload);
    this.closeFirstEditDialog();
  };

  onStatusChange = (s) => {
    console.log('new status', s);
    this.props.updateStatus(s);
  };

  render() {
    const profile = this.props.profile.profile;
    const user = this.props.user;
    const { isFirstEditDialogOpenned, current_dob } = this.state;
    return (
      <div>
        <main role='main' className='container mt-4'>
          <div className='row'>
            <div className='col-md-4 order-md-2 mb-2'>
              <StatusBlock
                changeStatus={this.onStatusChange}
                profile={profile}
              />
              <SkillsBlock addModal={this.addSkillModal} profile={profile} />
              <LinksBlock profile={profile} />
            </div>
            <div className='col-md-8 order-md-1'>
              <FirstBlock
                editModal={this.openFirstModal}
                profile={profile}
                user={user}
              />
              <SecondBlock addModal={this.addSecondModal} profile={profile} />
              <ThirdBlock addModal={this.addThirdModal} profile={profile} />
            </div>
          </div>
        </main>
        <EditFirst
          modalIsOpen={isFirstEditDialogOpenned}
          closeModal={this.closeFirstEditDialog}
          profile={profile}
          onDoBChange={this.onDoBChange}
          current_dob={current_dob}
          submitForm={this.onProfileUpdateFirst}
        />

        <AddSecond
          modalIsOpen={this.state.isSecondAddDialogOpenned}
          closeModal={this.closeSecondAddDialog}
          profile={profile}
          submitForm={this.onProfileUpdateSecond}
          toggleCurrentlyWorking={this.toggleCurrentlyWorking}
          isCurrentlyWorking={this.state.isCurrentlyWorking}
          currentFrom={this.state.current_from}
          currentTo={this.state.current_to}
          onFromChanged={this.onFromChanged}
          onToChanged={this.onToChanged}
        />

        <AddThird
          modalIsOpen={this.state.isThirdAddDialogOpenned}
          closeModal={this.closeThirdAddDialog}
          profile={profile}
          submitForm={this.onProfileUpdateThird}
          toggleCurrentlyWorking={this.toggleCurrentlyWorking}
          isCurrentlyWorking={this.state.isCurrentlyWorking}
          currentFrom={this.state.current_from}
          currentTo={this.state.current_to}
          onFromChanged={this.onFromChanged}
          onToChanged={this.onToChanged}
        />

        <AddSkills
          modalIsOpen={this.state.isSkillAddDialogOpenned}
          closeModal={this.closeSkillAddDialog}
          profile={profile}
          submitForm={this.onProfileUpdateSkill}
          toggleCurrentlyWorking={this.toggleCurrentlyWorking}
          isCurrentlyWorking={this.state.isCurrentlyWorking}
          currentFrom={this.state.current_from}
          currentTo={this.state.current_to}
          onFromChanged={this.onFromChanged}
          onToChanged={this.onToChanged}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  updateProfile,
  updateStatus,
  addExperience,
  addProject,
  addSkill,
})(Me);
