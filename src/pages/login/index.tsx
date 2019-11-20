import React, { ChangeEventHandler } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { userLoginAction, userLogoutAction } from '../../actions/user';
import { ILoginState, IStoreState } from '../../constants/store.d';
import WxLogin from './components/WxLogin';
import './index.less';
import {
    TOKEN_FETCH_REQUESTED_ACTION,
    tokenFetchRequstedAction,
    tokenFetchSucceededAction,
    tokenFetchFailedAction,
} from '../../actions/token';

const mapStateToProps = (state: IStoreState) => {
    // console.log(state);
    return {
        router: state.router,
        user: state.user,
        token: state.token,
    };
};
type IStateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
    userLoginAction,
    userLogoutAction,
    tokenFetchRequstedAction,
    tokenFetchSucceededAction,
};
type IDispatchProps = typeof mapDispatchToProps;
type IProps = IStateProps & IDispatchProps;

type IState = {
    appid: string,
    redirectUri: string,
    fields: {
        username: string,
        password: string,
        token: string,
        messages: Array<string>,
    }
}
class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            appid: 'wxbdc5610cc59c1631',
            redirectUri: 'https://passport.yhd.com/wechat/callback.do',
            fields: props.token,
        }
    }

    handleFormChange = (changedFields: ILoginState) => {
        // this.setState(({ fields }) => ({
        //     fields: { ...fields, ...changedFields },
        // }));
        this.props.tokenFetchSucceededAction(changedFields);
    }

    handleFormSubmit = (submitedFormData: ILoginState) => {
        // console.log(submitedFormData);
        this.props.tokenFetchRequstedAction(submitedFormData);
    }

    render() {
        // const fields = this.state.fields;
        // console.log(fields);
        return (
            <div className="login-wrapper">
                <LoginForm
                    fields={this.props.token}
                    onChange={this.handleFormChange}
                    onSubmit={this.handleFormSubmit}
                />
                <WxLogin appid={this.state.appid} redirectUri={this.state.redirectUri} />
            </div>
        );
    }
}

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);