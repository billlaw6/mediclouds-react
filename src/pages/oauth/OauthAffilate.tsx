import React from "react";
import { Link } from "react-router-dom";
import qs from "qs";
import { connect } from "react-redux";
import { StoreStateI } from "_types/core";
import { setTokenAction, setUserAction } from "_actions/user";
import userApi from "_api/user";

class OauthAffiliate extends React.Component<any, { registered: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      registered: false,
    };
  }

  componentDidMount(): void {
    const query = this.props.router.location.search.substr(1);
    const obj = qs.parse(query);

    if (obj.code) {
      userApi
        .loginWechat(obj)
        .then((res) => {
          this.setState({ registered: true });
        })
        .catch((error) => console.error(error));
    } else {
      console.log("no code");
    }
  }

  render() {
    const { registered } = this.state;

    return (
      <div className="login-redirect" style={{ width: "100%", padding: "38px 0" }}>
        {!registered ? <span>正在注册...</span> : <span>注册成功</span>}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStateI) => {
  return {
    // router: state.router,
  };
};

const mapDispatchToProps = {
  setToken: setTokenAction,
  setUser: setUserAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(OauthAffiliate);
